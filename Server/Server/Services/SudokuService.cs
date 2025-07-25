using System.Data;
using System.Text;
using Server.Errors;
using Server.Models;
using Server.Services.Interfaces;

namespace Server.Services;

public class SudokuService : ISudokuService
{
    public string GenerateSudokuBoard(string difficulty, HttpContext context)
    {
        Random rand = new();
        int[,] board = new int[9, 9];
        FillBoard(board, rand);
        string flattenedBoard = FlattenBoard(board);
        context.Session.SetString("SudokuBoard", flattenedBoard);
        return MakePartialBoard(board, flattenedBoard, difficulty, rand);
    }

    public bool CheckUserInput(UserInputDto userInputDto, HttpContext context)
    {
        string solvedBoard =
            context.Session.GetString("SudokuBoard")
            ?? throw new BadRequestException("No board found.");
        return solvedBoard[userInputDto.Index] == userInputDto.Value + '0';
    }

    private static bool FillBoard(int[,] board, Random rand)
    {
        for (int row = 0; row < 9; row++)
        {
            for (int col = 0; col < 9; col++)
            {
                if (board[row, col] == 0)
                {
                    List<int> nums = GetShuffledNumbers(rand);
                    foreach (int num in nums)
                    {
                        if (IsValid(board, row, col, num))
                        {
                            board[row, col] = num;
                            if (FillBoard(board, rand))
                                return true;
                            board[row, col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private static List<int> GetShuffledNumbers(Random rand)
    {
        List<int> nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        int length = 9;

        while (length > 1)
        {
            length--;
            int k = rand.Next(length + 1);
            (nums[length], nums[k]) = (nums[k], nums[length]);
        }

        return nums;
    }

    private static bool IsValid(int[,] board, int row, int col, int val)
    {
        for (int c = 0; c < 9; c++)
            if (c != col && board[row, c] == val)
                return false;

        for (int r = 0; r < 9; r++)
            if (r != row && board[r, col] == val)
                return false;

        int startRow = row - (row % 3);
        int startCol = col - (col % 3);
        for (int r = startRow; r < startRow + 3; r++)
        {
            for (int c = startCol; c < startCol + 3; c++)
            {
                if ((r != row || c != col) && board[r, c] == val)
                    return false;
            }
        }
        return true;
    }

    private static string FlattenBoard(int[,] board)
    {
        StringBuilder sb = new(81);

        for (int row = 0; row < 9; row++)
        {
            for (int col = 0; col < 9; col++)
            {
                sb.Append(board[row, col]);
            }
        }

        return sb.ToString();
    }

    private static string MakePartialBoard(
        int[,] board,
        string flattenedBoard,
        string difficulty,
        Random rand
    )
    {
        char[] boardChars = flattenedBoard.ToCharArray();

        int blanksToMake = difficulty switch
        {
            "Easy" => 37,
            "Medium" => 45,
            "Hard" => 53,
            "Expert" => 61,
            _ => 45,
        };
        int blanksMade = 0;

        int attempts = 0;
        int maxAttempts = 1000;

        while (blanksMade < blanksToMake && attempts < maxAttempts)
        {
            attempts++;
            int pos = rand.Next(81);
            int row = pos / 9;
            int col = pos % 9;

            if (board[row, col] != 0)
            {
                int backup = board[row, col];
                board[row, col] = 0;

                int solutions = 0;
                SolveAndCount(board, ref solutions);

                if (solutions != 1)
                {
                    board[row, col] = backup;
                }
                else
                {
                    boardChars[pos] = '.';
                    blanksMade++;
                }
            }
        }

        return new string(boardChars);
    }

    private static void SolveAndCount(int[,] board, ref int solutions)
    {
        (int row, int col)? cell = FindCellWithLeastOptions(board);

        if (cell == null)
        {
            solutions++;
            return;
        }

        (int row, int col) = cell.Value;

        for (int num = 1; num <= 9; num++)
        {
            if (IsValid(board, row, col, num))
            {
                board[row, col] = num;
                SolveAndCount(board, ref solutions);
                board[row, col] = 0;
                if (solutions > 1)
                    return;
            }
        }
    }

    private static (int row, int col)? FindCellWithLeastOptions(int[,] board)
    {
        int minOptions = 10;
        (int, int)? cell = null;

        for (int row = 0; row < 9; row++)
        {
            for (int col = 0; col < 9; col++)
            {
                if (board[row, col] == 0)
                {
                    int options = 0;
                    for (int num = 1; num <= 9; num++)
                    {
                        if (IsValid(board, row, col, num))
                            options++;
                    }

                    if (options < minOptions)
                    {
                        minOptions = options;
                        cell = (row, col);

                        if (minOptions == 1)
                            return cell;
                    }
                }
            }
        }

        return cell;
    }
}
