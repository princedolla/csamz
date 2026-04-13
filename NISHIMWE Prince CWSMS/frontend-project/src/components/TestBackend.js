import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TestBackend = () => {
    const [testResult, setTestResult] = useState('');

    const testBackend = async () => {
        try {
            const response = await axios.get('http://localhost:5000/');
            setTestResult(JSON.stringify(response.data, null, 2));
            toast.success('Backend is reachable!');
        } catch (error) {
            setTestResult('Error: ' + error.message);
            toast.error('Cannot reach backend');
        }
    };

    return (
        <div className="p-4">
            <button onClick={testBackend} className="btn-primary">
                Test Backend Connection
            </button>
            {testResult && (
                <pre className="mt-4 p-4 bg-gray-100 rounded">
                    {testResult}
                </pre>
            )}
        </div>
    );
};

export default TestBackend;