import { Button } from "flowbite-react";
import { ISettings } from "../interfaces";
import Playground from "./playground";
import { useState } from "react";
import { Between } from "../services";



const portfolio = [
    {
        ticker: "AAPL",
        shares: Between(100, 200),
        cost: Between(120, 200),
        price: Between(250, 310),
    },
    {
        ticker: "MSFT",
        shares: Between(100, 200),
        cost: Between(110, 120),
        price: Between(120, 200),
    },
    {
        ticker: "GOOG",
        shares: 100,
        cost: 95.00,
        price: 110.00,
    },
    {
        ticker: "TSLA",
        shares: Between(100, 200),
        cost: 900.00,
        price: 400.00
    }
]

const otherOptions = [
    {
        ticker: "FTEC",
        type: "ETF",
        return10: "15.00",
    },
    {
        ticker: "BofA",
        type: "CD",
        return10: "7.00",
    },
    {
        ticker: "US Gov",
        type: "Bond",
        return10: "9.00",
    }
]

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const Finance = (props: { settings: ISettings }) => {

    let financeState = { role: '', context: '' }
    let [state, setState] = useState(financeState)

    const Gain = (shares: number, cost: number, price: number) => {
        return shares * price - shares * cost
    }

    const RowBG = (shares: number, cost: number, price: number) => {
        const gain = Gain(shares, cost, price)
        if (gain > 0) {
            return "bg-green-100 hover:bg-green-200 border-b-2 border-slate-800"
        } else {
            return "bg-red-100 hover:bg-red-200 border-b-2 border-slate-800"
        }
    }

    const LoadContext = () => {
        let sb = "My Portfolio:\n"
        portfolio.forEach((investment) => {
            sb += `${investment.ticker}, Quantity:${investment.shares} Cost: ${investment.cost}, Price: ${investment.price}, Profit/Loss: ${Gain(investment.shares, investment.cost, investment.price)}\n`
        })
        sb += "\nPossible Investment not in my portfolio:\n"
        otherOptions.forEach((investment) => {
            sb += `${investment.ticker}, Type: ${investment.type} 10-year return: ${investment.return10}\n`
        })
        setState({ ...state, role: 'You are an assistant that can help analyze an investment portfolio.', context: sb })
    }

    return (
        <>
            <div className="container mx-auto">
                <h1 className="mt-4">Finance</h1>

                <div className="flex flex-col w-full">
                    <label className="uppercase mb-2 font-bold">Portfolio:</label>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-slate-800 text-white">
                                <th>Ticker</th>
                                <th>Shares</th>
                                <th>Cost</th>
                                <th>Price</th>
                                <th>Value</th>
                                <th>P/L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio.map((investment, idx) => {
                                return (
                                    <tr key={idx} className={RowBG(investment.shares, investment.cost, investment.price)}>
                                        <td className="font-bold p-2">{investment.ticker}</td>
                                        <td align="center" className="p-2">{investment.shares}</td>
                                        <td align="right" className="p-2">{formatter.format(investment.cost)}</td>
                                        <td align="right" className="p-2">{formatter.format(investment.price)}</td>
                                        <td align="right" className="p-2">{formatter.format(investment.price * investment.shares)}</td>
                                        <td align="right" className="table-cell p-2">{formatter.format(Gain(investment.shares, investment.cost, investment.price))}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <label className="uppercase mt-3 mb-2 font-bold">Other Options:</label>
                    <table>
                        <thead>
                            <tr className="bg-slate-800 text-white">
                                <th>Ticker</th>
                                <th>Type</th>
                                <th>10yr Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {otherOptions.map((investment, idx) => {
                                return (
                                    <tr key={"o" + idx} className="bg-slate-100 hover:bg-slate-200 border-b-2 border-slate-800">
                                        <td className="font-bold p-2">{investment.ticker}</td>
                                        <td align="center" className="p-2">{investment.type}</td>
                                        <td align="right" className="p-2">{investment.return10}%</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <Button className="mt-4 w-[200px]" onClick={LoadContext}>
                        Load Context
                    </Button>
                </div>
            </div>
            {state.context !== "" ? <Playground settings={props.settings} role={state.role} context={state.context} /> : null}
        </>
    )
}
export default Finance;