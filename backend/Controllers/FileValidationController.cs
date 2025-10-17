using Microsoft.AspNetCore.Mvc;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Backend.Models;
using System.Text.Json;
using MarketingSite.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileValidationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FileValidationController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpPost("validate")]
        public async Task<ActionResult<FileValidationResult>> ValidateFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            if (!file.FileName.EndsWith(".xlsx") && !file.FileName.EndsWith(".xls"))
                return BadRequest("Only Excel files (.xlsx, .xls) are supported");

            var result = new FileValidationResult();
            var rowDataList = new List<ExcelRowData>();

            try
            {
                using var stream = file.OpenReadStream();
                using var document = SpreadsheetDocument.Open(stream, false);
                var workbookPart = document.WorkbookPart;
                var worksheetPart = workbookPart?.WorksheetParts.FirstOrDefault();
                
                if (worksheetPart?.Worksheet == null)
                {
                    result.Errors.Add("Excel file is empty");
                    return Ok(result);
                }

                var sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();
                if (sheetData == null)
                {
                    result.Errors.Add("Excel file has no data");
                    return Ok(result);
                }
                
                var rows = sheetData.Elements<Row>().ToList();
                
                if (rows.Count == 0)
                {
                    result.Errors.Add("Excel file has no data");
                    return Ok(result);
                }

                result.TotalRows = rows.Count - 1; // Exclude header

                // Get headers
                var headerRow = rows.First();
                var headers = new List<string>();
                foreach (var cell in headerRow.Elements<Cell>())
                {
                    headers.Add(GetCellValue(cell, workbookPart));
                }

                // Validate headers
                var headerValidator = new HeaderValidator();
                var headerValidationResult = await headerValidator.ValidateAsync(headers);
                if (!headerValidationResult.IsValid)
                {
                    foreach (var error in headerValidationResult.Errors)
                    {
                        result.Errors.Add(error.ErrorMessage);
                    }
                }

                // Get valid states from database
                var validStates = await _context.States.Where(s => s.IsActive).Select(s => s.Name).ToListAsync();

                // Process data rows
                for (int i = 1; i < rows.Count; i++)
                {
                    var row = rows[i];
                    var rowData = new ExcelRowData { RowNumber = i + 1 };
                    var cells = row.Elements<Cell>().ToList();
                    
                    for (int j = 0; j < headers.Count && j < cells.Count; j++)
                    {
                        var header = headers[j];
                        var cellValue = GetCellValue(cells[j], workbookPart);
                        rowData.Data[header] = cellValue;
                    }

                    rowDataList.Add(rowData);
                }

                // Apply FluentValidation
                var validator = new ExcelRowValidator(validStates);
                var validRowCount = 0;

                foreach (var rowData in rowDataList)
                {
                    var validationResult = await validator.ValidateAsync(rowData);
                    
                    if (validationResult.IsValid)
                    {
                        validRowCount++;
                    }
                    else
                    {
                        foreach (var error in validationResult.Errors)
                        {
                            var message = error.ErrorMessage.Replace("{PropertyName}", rowData.RowNumber.ToString());
                            result.Errors.Add(message);
                        }
                    }
                }

                result.ValidRows = validRowCount;
                result.IsValid = result.Errors.Count == 0;

                // Convert to JSON if valid
                if (result.IsValid)
                {
                    var jsonData = new
                    {
                        metadata = new
                        {
                            processedAt = DateTime.UtcNow,
                            totalRows = result.TotalRows,
                            validRows = result.ValidRows,
                            headers = headers
                        },
                        data = rowDataList.Select(r => r.Data).ToList()
                    };

                    result.JsonData = JsonSerializer.Serialize(jsonData, new JsonSerializerOptions { WriteIndented = true });
                }
            }
            catch (Exception ex)
            {
                result.Errors.Add($"Error processing Excel file: {ex.Message}");
            }

            return Ok(result);
        }

        private string GetCellValue(Cell cell, WorkbookPart workbookPart)
        {
            if (cell?.CellValue?.Text == null) return string.Empty;
            
            var value = cell.CellValue.Text;
            
            if (cell.DataType?.Value == CellValues.SharedString)
            {
                var sharedStringTable = workbookPart.SharedStringTablePart?.SharedStringTable;
                if (sharedStringTable != null && int.TryParse(value, out var index))
                {
                    return sharedStringTable.Elements<SharedStringItem>().ElementAtOrDefault(index)?.InnerText ?? string.Empty;
                }
            }
            
            return value;
        }
    }
}