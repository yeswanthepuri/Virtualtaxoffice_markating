using FluentValidation;

namespace Backend.Models
{
    public class ExcelRowData
    {
        public int RowNumber { get; set; }
        public Dictionary<string, object?> Data { get; set; } = new();
    }

    public class FileValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new();
        public string? JsonData { get; set; }
        public int TotalRows { get; set; }
        public int ValidRows { get; set; }
    }

    public class HeaderValidator : AbstractValidator<List<string>>
    {
        public HeaderValidator()
        {
            RuleFor(x => x)
                .Must(headers => headers.Contains("State", StringComparer.OrdinalIgnoreCase))
                .WithMessage("State column is required");

            RuleForEach(x => x)
                .MaximumLength(60)
                .WithMessage("Header '{PropertyValue}' exceeds 60 characters");
        }
    }

    public class ExcelRowValidator : AbstractValidator<ExcelRowData>
    {
        private readonly List<string> _validStates;

        public ExcelRowValidator(List<string> validStates)
        {
            _validStates = validStates;

            // State validation (required)
            RuleFor(x => x.Data["State"])
                .NotNull()
                .NotEmpty()
                .WithMessage("Row {PropertyName}: State is required")
                .Must(state => IsValidState(state?.ToString()))
                .WithMessage("Row {PropertyName}: Invalid state");

            // Validate all data fields for length
            RuleFor(x => x.Data)
                .Must(data => ValidateDataLengths(data))
                .WithMessage("Row {PropertyName}: Data exceeds 600 characters");
        }

        private bool IsValidState(string? state)
        {
            if (string.IsNullOrEmpty(state)) return false;
            return _validStates.Contains(state, StringComparer.OrdinalIgnoreCase);
        }

        private bool ValidateDataLengths(Dictionary<string, object?> data)
        {
            foreach (var item in data)
            {
                var value = item.Value?.ToString() ?? "";
                if (value.Length > 600)
                    return false;
            }
            return true;
        }
    }
}