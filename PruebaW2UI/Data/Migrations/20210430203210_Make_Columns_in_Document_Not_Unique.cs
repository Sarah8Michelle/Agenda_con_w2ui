using Microsoft.EntityFrameworkCore.Migrations;

namespace PruebaW2UI.Migrations
{
    public partial class Make_Columns_in_Document_Not_Unique : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Documents_DocumentTypeId",
                table: "Documents");

            migrationBuilder.DropIndex(
                name: "IX_Documents_PersonId",
                table: "Documents");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_DocumentTypeId",
                table: "Documents",
                column: "DocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_PersonId",
                table: "Documents",
                column: "PersonId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Documents_DocumentTypeId",
                table: "Documents");

            migrationBuilder.DropIndex(
                name: "IX_Documents_PersonId",
                table: "Documents");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_DocumentTypeId",
                table: "Documents",
                column: "DocumentTypeId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Documents_PersonId",
                table: "Documents",
                column: "PersonId",
                unique: true);
        }
    }
}
