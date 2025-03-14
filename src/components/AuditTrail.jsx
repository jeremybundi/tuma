import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditModal from './EditModal';

export default function AuditTrail() {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const recordsPerPage = 9;


  const convertToKenyanTime = (utcDateString) => {
    const date = new Date(utcDateString);
    return date.toLocaleString("en-KE", { timeZone: "Africa/Nairobi" });
  };
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          'https://tuma-dev-backend-alb-1553448571.us-east-1.elb.amazonaws.com/api/treasury/currency-exchange-history'
        );
        const sortedRecords = response.data.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt)); // Sorting by latest first
        setRecords(sortedRecords);
      } catch (error) {
        console.error('Error fetching audit trail:', error);
      }
    };
  
    // Fetch initially
    fetchRecords();
  
    // Poll every 1 second
    const interval = setInterval(fetchRecords, 1000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="p-4 bg-white w-full  px-14 flex flex-col">
      <h1 className="text-lg font-bold ml-6 mb-4 mt-6">Audit Trail</h1>

      <div className="flex-1 pb-6">
        <table className="w-full border bg-white">
          <thead>
            <tr className="text-left bg-gray-50  text-gray-500 text-sm">
              <th className="py-2 px-4 border-b">Currency Pair</th>
              <th className="py-2 px-4 border-b">Rate</th>
              <th className="py-2 px-4 border-b">Date of Effect</th>
              <th className="py-2 px-4 border-b">Last Updated</th>
              <th className="py-2 px-4 border-b">Updated By</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record) => (
              <tr key={record.id} className="border-b">
                <td className="py-2 px-4 text-sm">{`${record.baseCurrency}/${record.targetCurrency}`}</td>
                <td className="py-2 px-4 text-sm">{record.newRate}</td>
                <td className="py-2 px-4 text-sm">{convertToKenyanTime(record.dateOfEffect)}</td> {/* Keeping it null */}
                <td className="py-2 text-gray-500 text-sm px-4">
                  {convertToKenyanTime(record.changedAt)}
                </td>
                <td className="py-2 text-gray-500 text-sm px-4">{record.changedBy}</td>
             


              
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <div>
          <button
            onClick={() => paginate(1)}
            className="px-4 py-2 mx-1 bg-gray-700 text-white font-semibold rounded-lg disabled:opacity-50"
            disabled={currentPage === 1}
          >
            &lt;&lt; First
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            className="px-4 py-2 mx-1 bg-gray-700 text-white font-semibold rounded-lg disabled:opacity-50"
            disabled={currentPage === 1}
          >
            &lt; Previous
          </button>
        </div>
        <span className="text-gray-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <div>
          <button
            onClick={() => paginate(currentPage + 1)}
            className="px-4 py-2 mx-1 bg-gray-700 text-white font-semibold rounded-lg disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
          <button
            onClick={() => paginate(totalPages)}
            className="px-4 py-2 mx-1 bg-gray-700 text-white font-semibold rounded-lg disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Last &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}