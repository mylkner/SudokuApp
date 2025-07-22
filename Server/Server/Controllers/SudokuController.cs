using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services.Interfaces;

namespace Server.Controllers;

[ApiController]
[Route("api/sudoku")]
public class SudokuController(ISudokuService sudokuService) : ControllerBase
{
    [HttpPost("generate-board")]
    public ActionResult<string> GetSudokuBoard(DifficultyDto difficultyDto)
    {
        string board = sudokuService.GenerateSudokuBoard(difficultyDto);
        return Ok(board);
    }

    [HttpPost("check-input")]
    public ActionResult<bool> CheckInput(UserInputDto userInputDto)
    {
        bool correct = sudokuService.CheckUserInput(userInputDto);
        return Ok(correct);
    }
}
