using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KiwiDrive.Migrations
{
    /// <inheritdoc />
    public partial class AddLastStreakDateToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastStreakDate",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastStreakDate",
                table: "Users");
        }
    }
}
