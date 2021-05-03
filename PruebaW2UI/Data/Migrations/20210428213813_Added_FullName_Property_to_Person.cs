using Microsoft.EntityFrameworkCore.Migrations;

namespace PruebaW2UI.Migrations
{
    public partial class Added_FullName_Property_to_Person : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "People",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FullName",
                table: "People");
        }
    }
}
