const User = require('../models/users');
const Expense = require('../models/expenses');
const sequelize = require('../util/database');

const getUserLeaderBoard = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name']
        })
        const userAggregatedExpenses = await Expense.findAll({
            attributes: ['userId', [sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost']],
            group: ['userID']
        });
        var userLeaderBoardDetails = [];
        users.forEach((user) => {
            userLeaderBoardDetails.push({ name: user.name, total_cost: userAggregatedExpenses[user.id] || 0 })
        })

       
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost)
        res.status(200).json(userLeaderBoardDetails)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}