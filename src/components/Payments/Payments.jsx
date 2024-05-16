import './Payments.css'
import { useState, useEffect } from 'react';

const  Payments = () => {
    const paymentsHead = ["ID", "Name", "Document Type"];
    const paymentsFilters = [
        {key: 0, id: 'None',      type:'none'}, 
        {key: 1, id: 'Invoices',  type:'invoices'}, 
        {key: 2, id: 'Purchases', type:'purchases'}
    ];
    const [payments, setPayments]             = useState([]);
    const [ limPayments, setLimPayments ]     = useState([]);
    const [ totalPayments, setTotalPayments ] = useState(0);
    const [ page, setPage ]                   = useState(1);
    const [ filter, setFilter ]               = useState('none');

    const paymentsHandler = (min, max, payments) => {
        setLimPayments(payments.slice(min, max));
        // console.log(limPayments)
    }
    const pageHandler = (page) => {
        const sum = 8;
        const minV = sum * (page - 1);
        const maxV = minV + (sum - 1);
        console.log(minV + " " + maxV);
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

    const filterHandler = (type, payments) => {
        switch(type){
            case 'none':
                paymentsHandler(0, 7, payments);
                break;
            case 'invoices':
                var filteredProducts = payments.filter((payment) =>
                    payment.documentType.toLowerCase().includes('invoice')
                  );
                setLimPayments(filteredProducts);
                break;
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
        <ul className='payments-filters-container'>
            {paymentsFilters.map(filter => <li key={filter.key} onClick={() =>filterHandler(filter.type, payments)}>{filter.id}</li>)}
        </ul>
        <ul className='payments-table-top table'>
            {paymentsHead.map((payment, i) => <li key={i}>{payment}</li>)}
        </ul>
        {<ul className='payments-table'>
             {limPayments.map(payment => 
                 <li key={payment.id}>
                     <p>{payment.id}</p>
                     <p>{payment.contactName}</p>
                     <p>{payment.documentType}</p>
                 </li>)}
         </ul>} 
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