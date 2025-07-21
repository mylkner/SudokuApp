namespace Server.Services.Interfaces;

public interface ISudokuService
{
    string GenerateSudokuBoard();
    bool CheckUserInput();
}
