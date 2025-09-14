import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Activity, Cpu, Settings } from "lucide-react";

export default function PredictiveForm() {
    const [formData, setFormData] = useState({
        MachineID: 0,
        Timestamp: "Akash",
        Temperature_last: 0,
        Vibration_last: 0,
        Pressure_last: 0,
        RunTimeHours_last: 0,
        Temperature_mean: 0,
        Temperature_std: 0,
        Vibration_mean: 0,
        Vibration_std: 0,
        Vibration_rms: 0,
        Vibration_spec_energy: 0,
        Pressure_mean: 0,
        Pressure_std: 0,
    });

    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "Timestamp" ? value : parseFloat(value) || 0,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Sending Data:", formData);

            const response = await axios.post(
                "http://localhost:5000/api/inference",
                formData
            );

            console.log("Prediction Result:", response.data);
            setResult(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container py-5">
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
                <Cpu className="text-primary me-2" size={32} />
                <h1 className="fw-bold text-dark">
                    Predictive Maintenance Dashboard
                </h1>
            </div>

            {/* Form Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card shadow-lg p-4"
            >
                <h2 className="h5 mb-4 d-flex align-items-center">
                    <Settings className="me-2 text-primary" size={20} />
                    Machine Input Data
                </h2>

                <form onSubmit={handleSubmit} className="row g-3">
                    {Object.keys(formData).map((key) => (
                        <div key={key} className="col-md-6">
                            <label className="form-label fw-semibold">
                                {key.replace(/_/g, " ")}
                            </label>
                            <input
                                type={key === "Timestamp" ? "text" : "number"}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="form-control"
                                step="any"
                            />
                        </div>
                    ))}

                    <div className="col-12 text-center">
                        <button
                            type="submit"
                            className="btn btn-primary px-5 py-2 fw-semibold"
                        >
                            Run Prediction
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Result Section */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="card shadow-lg p-4 mt-4"
                >
                    <h3 className="h6 fw-bold mb-3 d-flex align-items-center">
                        <Activity className="me-2 text-success" size={20} />
                        Prediction Result
                    </h3>
                    <pre className="bg-light p-3 rounded small text-dark overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>

                    {/* 🔔 Bootstrap Alerts */}
                    {"probability" in result && (
                        <div className="mt-3">
                            {result.probability > 0.7 ? (
                                <div className="alert alert-danger fw-semibold">
                                    🚨 Critical Alert: Failure probability is{" "}
                                    {Math.round(result.probability * 100)}%
                                </div>
                            ) : result.probability > 0.4 ? (
                                <div className="alert alert-warning fw-semibold">
                                    ⚠️ Warning: Failure probability is{" "}
                                    {Math.round(result.probability * 100)}%
                                </div>
                            ) : (
                                <div className="alert alert-success fw-semibold">
                                    ✅ Machine is healthy (Failure probability:{" "}
                                    {Math.round(result.probability * 100)}%)
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
