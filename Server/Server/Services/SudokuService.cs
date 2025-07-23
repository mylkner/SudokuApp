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
        return MakePartialBoard(flattenedBoard, difficulty, rand);
    }

    public bool CheckUserInput(UserInputDto userInputDto, HttpContext context)
    {
        string solvedBoard =
            context.Session.GetString("SudokuBoard")
            ?? throw new BadRequestException("No board found");

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

    private static string MakePartialBoard(string flattenedBoard, string difficulty, Random rand)
    {
        char[] board = flattenedBoard.ToCharArray();
        //todo: add unique solution check
        int blanksToMake = difficulty switch
        {
            "Easy" => 35,
            "Medium" => 45,
            "Hard" => 53,
            "Expert" => 61,
            _ => 45,
        };
        int blanksMade = 0;

        while (blanksMade < blanksToMake)
        {
            int pos = rand.Next(81);
            if (board[pos] != '.')
            {
                board[pos] = '.';
                blanksMade++;
            }
        }

        return new string(board);
    }
}
