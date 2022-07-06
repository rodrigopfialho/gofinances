import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { ActivityIndicator } from "react-native";
import { HighlighCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer,
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighLightProps {
    amount: string;
    lastTransaction: string;
}

interface HighLightData {
    entries: HighLightProps;
    expensive: HighLightProps;
    total: HighLightProps;
}

export function Dashboard() {
    const [isLoading, setisLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData)

    const theme = useTheme()
    const {signOut, user} = useAuth()

    function getLastTransactionDate(
        collection: DataListProps[], 
        type: 'positive' | 'negative'
        ){

        const collectionFilttered = collection
        .filter(transaction => transaction.type === type)    

        if(collectionFilttered.length === 0) {
            return 0
        }

        const lastTransactions = new Date(
        Math.max.apply(Math, collectionFilttered
            .map(transaction => new Date(transaction.date).getTime())))
            
       return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleDateString('pt-BR', {month: 'long'})}`    
        
    }

    async function loadTransactions() {
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
            .map((item: DataListProps) => {

                if (item.type === 'positive') {
                    entriesTotal += Number(item.amount)
                } else {
                    expensiveTotal += Number(item.amount)
                }

                const amount = Number(item.amount)
                    .toLocaleString('pt-BR' , {
                        style: 'currency',
                        currency: 'BRL'
                    });

                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date,
                }

            });

        setTransactions(transactionsFormatted);

        const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive')
        const lastTransactionsExpensives = getLastTransactionDate(transactions, 'negative')


        const totalInterval  = lastTransactionsExpensives === 0 ? 'Não há transações' : `01 a ${lastTransactionsExpensives}` ;

        const total = entriesTotal - expensiveTotal

        setHighLightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionsEntries === 0 ? 'Não há transações' : `Última entrada dia ${lastTransactionsEntries}`,
            },
            expensive: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionsExpensives === 0 ? 'Não há transações' : `Última saída dia ${lastTransactionsExpensives}`,
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),
                lastTransaction: totalInterval
            }

        })

        // console.log(transactionsFormatted)
        setisLoading(false)
    }

    // async function removeAll() {
    //     await AsyncStorage.removeItem(dataKey)
    // removeAll()
    // }


    useEffect(() => {
        loadTransactions()
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions()
    }, []));


    return (
        <Container>  
            {
                isLoading ? 
                <LoadContainer> 
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer> :
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo source={{ uri: user.photo}} />
                                <User>
                                    <UserGreeting>Olá,</UserGreeting>
                                    <UserName>{user.name}</UserName>
                                </User>
                            </UserInfo>

                            <LogoutButton onPress={signOut}>
                                <Icon name="power" />
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards>
                        <HighlighCard
                            type="up"
                            title="Entradas"
                            amount={ highLightData.entries.amount }
                            lastTransaction={highLightData.entries.lastTransaction}
                        />

                        <HighlighCard
                            type="down"
                            title="Saída"
                            amount={highLightData.expensive.amount}
                            lastTransaction={highLightData.expensive.lastTransaction}
                        />

                        <HighlighCard
                            type="total"
                            title="Total"
                            amount={highLightData.total.amount}
                            lastTransaction={highLightData.total.lastTransaction}
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>

                        <TransactionList
                            data={transactions}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} />}
                        />
                    </Transactions>
                </>
            }
        </Container>
    )
}
