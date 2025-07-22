using Server.Models;

namespace Server.Services.Interfaces;

public interface ISudokuService
{
    string GenerateSudokuBoard(string difficulty);
    bool CheckUserInput(UserInputDto userInputDto);
}
