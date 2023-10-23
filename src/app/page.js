"use client"
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Table1 from './Table'
import History from './History'
import Form from './Form' 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const page = () => {
  
  const [amount, setamount] = useState("")
  const [desc, setdesc] = useState("")

  const modes = ['cash', 'online', 'loan'];
  const [mode, setMode] = useState("cash")

  const [credit, setcredit] = useState("0")
  const [debit, setDebit] = useState("0")
  const [loan, setLoan] = useState("0")
  const [total, settotal] = useState("0")
  const [loanrepayment, setloanrepayment] = useState(NaN)

  const [mainTask, setMainTask] = useState([])

  const submitHandler = (e)=>{
    e.preventDefault()
    const currentCredit = parseFloat(credit);
    const currentDebit = parseFloat(debit);
    const currentLoan = parseFloat(loan)
    const currentTotal = parseFloat(total)
    const newAmount = parseFloat(amount);
    const CurrentDate = moment().format('MMMM Do YYYY')

    const updatedTotal = currentTotal + newAmount

    if(newAmount>0)
    {
      if(mode === 'loan')
      {
        const updateLoan = currentLoan + newAmount
        setLoan(updateLoan)
      }
      else {
      const updatedCredit = currentCredit + newAmount
      setcredit(updatedCredit)
      settotal(updatedTotal)
      }
    }
    if(newAmount<0)
    {
      if((newAmount + currentTotal) < 0)
      {
        toast.error("Debit amount cannot be more than total holdings.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
          });
          return;
      }
      const updatedDebit = currentDebit + newAmount
      setDebit(updatedDebit)
      settotal(updatedTotal)
    }
    setMainTask([... mainTask, {amount, desc, mode, CurrentDate}])
    console.log(mainTask)
    setamount("")
    setdesc("")
  }

  const loan_handler =(loan, loanrepayment, total, debit, transactionHandler)=>{
    let updatedTransactionData
    if(isNaN(loanrepayment) || loanrepayment < 0)
    {
      toast.error("Enter a valid value first", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        });
    }
    else if(loan == 0)
    {
      toast("No loans are due", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        });
    }
    else if(loanrepayment>total)
    {
      toast.error("The loan amount is more than money availible. Cannot process the transaction.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        });
    }

    else if(loanrepayment > loan)
    {
      toast.info("The amount entered is more than the loan you have. Automatically entering the value equal to loan.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        });

      total = total - loan
      debit = debit - loan
      settotal(total)
      setLoan("0")
      setDebit(debit)

      updatedTransactionData = {
        amount: loan,
        desc: "Loan Repaid",
        mode: "loan",
        CurrentDate: moment().format('MMMM Do YYYY')
      };
      transactionHandler.push(updatedTransactionData)
      toast.success("Loan Repaid", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        });
    }

    else{
      total = total - loanrepayment
      debit = debit - loanrepayment
      loan = loan - loanrepayment
      settotal(total)
      setLoan(loan)
      setDebit(debit)

      updatedTransactionData = {
        amount: loanrepayment,
        desc: "Loan Repaid",
        mode: "loan",
        CurrentDate: moment().format('MMMM Do YYYY')
      };
      transactionHandler.push(updatedTransactionData)
      toast.success("Loan Repaid", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        });
    }
  }
  
  let totalColor = "white"
  if((total < 0))
  {
    totalColor="rgba(255,0,0,0.7)"
  }

  let renderTask = <h2 className='text-center'>No Transaction History Availible</h2>
  if(mainTask.length>0)
  {
    renderTask = mainTask.map((t,i)=>{  
    let listColor
    if(t.mode === 'loan')
    {
      listColor = " linear-gradient(to right, rgba(0,0,255,0), rgba(0,0,255,0.7))"
    }
      return(
        <li key={i} className='border-sky-300 border-b-2 flex justify-between mb-4' style={{backgroundImage: listColor}}>
        <h5 className='text-xl font-semibold pl-10 min-w-[25%]'>{'\u20B9'}{t.amount}</h5>
        <h6 className='text-center truncate text-xl font-semibold min-w-[25%] max-w-[25%]'>{t.desc}</h6>
        <h6 className='text-center text-xl font-semibold min-w-[25%]'>{t.mode}</h6>
        <h6 className='text-right text-xl font-semibold pr-5 min-w-[25%]'>{t.CurrentDate}</h6>
      </li>
      )
    })
  }

  return (
    <>
    <div className='bg-black flex justify-center'>
    <h3 className='text-white p-3 text-3xl font-bold text-center mt-2'>My Expense Tracker</h3>
    </div>
    <Form amount={amount} desc={desc} mode={mode} modes={modes} submitHandler={submitHandler} setamount={setamount} setdesc={setdesc} setMode={setMode}/>
    <hr/> <br/>
    <Table1 credit={credit} debit={debit} loan={loan} total={total} totalColor={totalColor} />
    <div className='flex items-center justify-center'>
    <input type='number' className='text-2xl border-zinc-800 border-2 m-5 px-4 py-2' placeholder='Enter loan amount paid'  value={loanrepayment} onChange={(e) =>{setloanrepayment(e.target.value)}}/>
    <button className='bg-black text-white px-4 py-3 text-2xl font-bold rounded m-5' onClick={()=>{{loan_handler(loan, loanrepayment, total, debit, mainTask)}}}>Loan Repaid</button>
    </div> <br/>
    <History renderTask={renderTask} />
    <hr />
    <ToastContainer />
   </>
  )
}
export default page
