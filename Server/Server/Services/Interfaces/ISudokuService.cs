using Server.Models;

namespace Server.Services.Interfaces;

public interface ISudokuService
{
    string GenerateSudokuBoard(string difficulty, HttpContext context);
    bool CheckUserInput(UserInputDto userInputDto, HttpContext context);
}
