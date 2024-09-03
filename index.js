const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const URI = 'mongodb://127.0.0.1:27017/expenseDB';
const expenseSchema = new mongoose.Schema({
    category : String,
    amount : String,
    title : String
})

const Expense = new mongoose.model('expenses', expenseSchema);

mongoose.connect(URI).then(()=>{
    console.log('db connected')
}).catch(err=>{
    console.log(err)
})

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))



app.get('/allExpenses', async(_, res)=>{
    let allExpenses = await Expense.find({});
    res.status(201).json(allExpenses);
})
app.post('/addExpense',async(req, res)=>{
    let addedExpense = await Expense.create({...req.body});
    res.status(201).json({_id: addedExpense._id});
})
app.put('/updateExpense', async(req, res)=>{
    let exp = req.body;
    await Expense.findOneAndUpdate({_id : exp._id}, {title : exp.title, amount : exp.amount, category : exp.category});
    res.status(201).json({message : 'success'});
})
app.delete('/deleteExpense', async(req, res)=>{
    let expenseId = req.body._id;
     await Expense.deleteOne({_id : expenseId});
    res.status(201).json({message : 'success'});
})


const port = process.env.PORT || 5000; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});