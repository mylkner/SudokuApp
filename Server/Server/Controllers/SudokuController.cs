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
        string board = sudokuService.GenerateSudokuBoard(difficultyDto.Difficulty, HttpContext);
        return Ok(board);
    }

    [HttpPost("check-input")]
    public ActionResult<bool> CheckInput(UserInputDto userInputDto)
    {
        bool correct = sudokuService.CheckUserInput(userInputDto, HttpContext);
        return Ok(correct);
    }

    [HttpDelete("remove-saved-board")]
    public IActionResult RemoveBoard()
    {
        HttpContext.Session.Remove("SudokuBoard");
        return Ok();
    }
}
