import React, { useState, useEffect } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getToken, formatPrice } from "../Utils/helpers";
import axios from "axios";
import Loader from '../Layout/Loader';

export default function MonthlySalesChart() {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const monthlySales = async () => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${getToken()}` } }
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/sales-per-month`, config)
            setSales(data.salesPerMonth)
            setLoading(false)
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to load monthly sales')
            setLoading(false)
        }
    }

    useEffect(() => { monthlySales() }, [])

    return (
        <div className="card mb-4">
            <div className="card-header bg-success text-white">
                <h4>Monthly Sales Trend</h4>
            </div>
            <div className="card-body">
                {loading ? <Loader /> : (
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart data={sales} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip formatter={(value) => [`₱${formatPrice(value)}`, 'Total']} />
                            <Legend />
                            <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}