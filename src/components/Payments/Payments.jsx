import './Payments.css'
import { useState, useEffect } from 'react';

const  Payments = () => {
    // Payments headers
    const paymentsHead = ["ID", "Owner", "Document Type"];
    // Payments Button Filters
    const paymentsFilters = [
        {key: 0, id: 'None',      type:'none'}, 
        {key: 1, id: 'Invoices',  type:'invoices'}, 
        {key: 2, id: 'Purchases', type:'purchases'}
    ];
    // All payments
    const [payments, setPayments]             = useState([]);
    // Page Payments
    const [ limPayments, setLimPayments ]     = useState([]);
    // Total pages
    const [ totalPayments, setTotalPayments ] = useState(0);
    // Current page
    const [ page, setPage ]                   = useState(1);
    // Filter value
    const [ filter, setFilter ]               = useState('none');

    // Payments handler to limit per page
    const paymentsHandler = (min, max, payments) => {
        setLimPayments(payments.slice(min, max));
    }
    // Page handlers
    const pageHandler = (page) => {
        // Amount of payments by page
        const sum = 8;
        // Min number calculation
        const minV = sum * (page - 1);
        // Max number calculation
        const maxV = minV + (sum - 1);
        paymentsHandler(minV, maxV, payments);
    }
    const prev = () => {
        if(page >= 1){
            setPage(page - 1);
            pageHandler(page - 1);
        }
    }
    const next = () => {
        if(page < totalPayments){
            setPage(page + 1);
            pageHandler(page + 1);
        }
    }

    // Filter type switcher to handle buttons filters
    const filterHandler = (type, payments) => {
        // Filter type
        switch(type){
            // No filter - everything back to default
            case 'none':
                paymentsHandler(0, 7, payments);
                break;
            // Filter invoices - to show only invoices
            case 'invoices':
                var filteredProducts = payments.filter((payment) =>
                    payment.documentType.toLowerCase().includes('invoice')
                  );
                setLimPayments(filteredProducts);
                break;
            // Filter invoices - to show only purchases
            case 'purchases':
                var filteredProducts = payments.filter((payment) =>
                    payment.documentType.toLowerCase().includes('purchase')
                  );
                setLimPayments(filteredProducts);
                break;
            default:
                paymentsHandler(0, 7, payments);
                break;
        }
    }

    // Call to the API (ExpressJs)
    useEffect(() => {
      fetch('http://localhost:9000/payments')
        .then(response => response.json())
        .then(response => {
          setPayments(response);
          setTotalPayments(response.length/8);
          paymentsHandler(0, 7, response); 
        })
        .catch(err => console.error(err));
    }, []);

    
  return (
    <div className='container'>
        {/* Payments Filters Buttons*/}
        <ul className='payments-filters-container'>
            {paymentsFilters.map(filter => <li key={filter.key} onClick={() =>filterHandler(filter.type, payments)}>{filter.id}</li>)}
        </ul>

        {/* Table Top */}
        <ul className='payments-table-top table'>
            {paymentsHead.map((payment, i) => <li key={i}>{payment}</li>)}
        </ul>

        {/* Table of Payments */}
        <ul className='payments-table'>
             {limPayments.map(payment => 
                 <li key={payment.id}>
                     <p>{payment.id}</p>
                     <p>{payment.contactName ? payment.contactName : <span className='unown'>-</span>}</p>
                     <p>{payment.documentType}</p>
                 </li>)}
         </ul>

        {/* <- Pages -> */}
        <ul className='pages'>
            <div onClick={prev.bind()} className={`arrow ${page === 1 || filter !== 'none' ? 'inactiveArrow' : ""}`} >
                <img src="src/assets/arrowLeft.svg" alt="arrow-previous" />
            </div>
            <div onClick={next.bind()} className={`arrow ${page === totalPayments || filter !== 'none' ? 'inactiveArrow' : ""}`}>
                <img src="src/assets/arrowRight.svg" alt="arrow-next" />
            </div>
        </ul>
    </div>
  )
}

export default Payments