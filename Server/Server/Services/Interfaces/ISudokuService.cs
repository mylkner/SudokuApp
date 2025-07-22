using Server.Models;

namespace Server.Services.Interfaces;

public interface ISudokuService
{
    string GenerateSudokuBoard(DifficultyDto difficultyDto);
    bool CheckUserInput(UserInputDto userInputDto);
}
