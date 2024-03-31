import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonAppBar from "../components/Header";
import TransactionChart from "../components/TransactionChart";
import TransactionForm from "../components/TransactionForm";
import TransactionsTable from "../components/TransactionsTable";
import { fetchTransaction } from "../redux/slices/transactionSlice";

function Home() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.transaction);
  const { transactions, loading } = state;
  const [editTransaction, setEditTransaction] = useState({});

  useEffect(() => {
    if (!transactions.length) {
      dispatch(fetchTransaction());
    }
  }, []);

  return (
    <Container maxWidth="lg">
      <TransactionChart />
      <TransactionForm
        editTransaction={editTransaction}
        setEditTransaction={setEditTransaction}
      />
      <TransactionsTable setEditTransaction={setEditTransaction} />
    </Container>
  );
}

export default Home;
