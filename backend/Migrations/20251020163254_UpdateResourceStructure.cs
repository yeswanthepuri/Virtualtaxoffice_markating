using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateResourceStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ResourceDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Resources",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "LinkDescription",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "LinkShortDescription",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "ResourceDetails",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "ResourceShortDescription",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "ResourceTitle",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Resources");

            migrationBuilder.RenameTable(
                name: "Resources",
                newName: "resources");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "resources",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "resources",
                newName: "created_at");

            migrationBuilder.AddColumn<long>(
                name: "resource_id",
                table: "resources",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "resources",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "resources",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_resources",
                table: "resources",
                column: "resource_id");

            migrationBuilder.CreateTable(
                name: "resource_sections",
                columns: table => new
                {
                    section_id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    resource_id = table.Column<long>(type: "bigint", nullable: false),
                    parent_section_id = table.Column<long>(type: "bigint", nullable: true),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resource_sections", x => x.section_id);
                    table.ForeignKey(
                        name: "FK_resource_sections_resource_sections_parent_section_id",
                        column: x => x.parent_section_id,
                        principalTable: "resource_sections",
                        principalColumn: "section_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_resource_sections_resources_resource_id",
                        column: x => x.resource_id,
                        principalTable: "resources",
                        principalColumn: "resource_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_resource_sections_parent_section_id",
                table: "resource_sections",
                column: "parent_section_id");

            migrationBuilder.CreateIndex(
                name: "IX_resource_sections_resource_id",
                table: "resource_sections",
                column: "resource_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "resource_sections");

            migrationBuilder.DropPrimaryKey(
                name: "PK_resources",
                table: "resources");

            migrationBuilder.DropColumn(
                name: "resource_id",
                table: "resources");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "resources");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "resources");

            migrationBuilder.RenameTable(
                name: "resources",
                newName: "Resources");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "Resources",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Resources",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Resources",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "LinkDescription",
                table: "Resources",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LinkShortDescription",
                table: "Resources",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ResourceDetails",
                table: "Resources",
                type: "character varying(10000)",
                maxLength: 10000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ResourceShortDescription",
                table: "Resources",
                type: "character varying(5000)",
                maxLength: 5000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ResourceTitle",
                table: "Resources",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Resources",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Resources",
                table: "Resources",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "ResourceDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ResourceId = table.Column<int>(type: "integer", nullable: false),
                    JsonData = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResourceDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResourceDetails_Resources_ResourceId",
                        column: x => x.ResourceId,
                        principalTable: "Resources",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ResourceDetails_ResourceId",
                table: "ResourceDetails",
                column: "ResourceId");
        }
    }
}
