using Microsoft.AspNetCore.Mvc;
using Server.Services.Interfaces;

namespace Server.Controllers;

[ApiController]
[Route("api/sudoku")]
public class SudokuController(ISudokuService sudokuService) : ControllerBase
{
    [HttpGet("generate-board")]
    public ActionResult<string> GetSudokuBoard()
    {
        string board = sudokuService.GenerateSudokuBoard();
        return Ok(board);
    }

    [HttpPost("check-input")]
    public ActionResult<bool> CheckInput()
    {
        bool correct = sudokuService.CheckUserInput();
        return Ok(correct);
    }
}
