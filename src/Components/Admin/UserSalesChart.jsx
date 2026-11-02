import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { getToken, formatPrice } from "../Utils/helpers";
import axios from "axios";
import Loader from '../Layout/Loader';

const UserSalesChart = () => {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const barColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]

    const userSales = async () => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${getToken()}` } }
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/customer-sales`, config)
            setSales(data.customerSales)
            setLoading(false)
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to load user sales')
            setLoading(false)
        }
    }

    useEffect(() => { userSales() }, [])

    return (
        <div className="card mb-4">
            <div className="card-header bg-info text-white">
                <h4>Customer Sales (Top Buyers)</h4>
            </div>
            <div className="card-body">
                {loading ? <Loader /> : (
                    <ResponsiveContainer width="100%" height={500}>
                        <BarChart data={sales} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="userDetails.name" tick={{ rotation: -45, fontSize: 11 }} />
                            <YAxis />
                            <Tooltip formatter={(value) => [`₱${formatPrice(value)}`, 'Total']} />
                            <Legend />
                            <Bar dataKey="total" name="Total Sales" stroke="#000" strokeWidth={2}>
                                {sales.map((item, index) => (
                                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
export default UserSalesChart