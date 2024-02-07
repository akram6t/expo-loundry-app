import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For tabular data rendering
import { currencyIcon } from './Constant';

function editPdf(doc, data, payments) {
    const totalAmount = data?.amount + data?.service_fee + data?.addons?.reduce((total, n) => total + n.price, 0) || 0;
    let totalPaymentAmount = 0;
    if (payments.length > 0) {
        totalPaymentAmount = payments.reduce((total, p) => total + p.amount, 0);
    }
    // Empty square
    // Add a full-width rectangle with a light gray background color
    doc.setFillColor(242, 242, 242);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 53, 'F');
    doc.setFillColor(5, 150, 105);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 15, 'F');

    // divider
    doc.setFillColor('gray');
    doc.rect(0, 54, doc.internal.pageSize.getWidth(), 0.5, 'F');

    // Invoice title
    doc.setFontSize(18);
    doc.setTextColor('white');
    doc.text(doc.internal.pageSize.getWidth() / 2 - 10, 9, 'Invoice');

    const paid = { label: 'Paid', color: 'green' };
    const unpaid = { label: 'Unpaid', color: 'red' };

    let activePaymentStatus = unpaid;


    // payment paid or not unpaid
    if (totalPaymentAmount >= totalAmount) {
        activePaymentStatus = paid;
    }
    doc.setFontSize(14);
    doc.setTextColor(activePaymentStatus.color);
    doc.text(170, 35, activePaymentStatus.label);

    // Store details
    doc.setTextColor('black');
    doc.setFontSize(12);
    doc.text(10, 25, `Store Name: ${data.storename}`);
    doc.text(10, 33, `Order ID: #${data.order_id}`);
    doc.text(10, 41, `Order Status: ${data?.order_status}`);
    doc.text(10, 49, `Order Date: ${new Date(data.order_date).toLocaleDateString()}`);

    // divider

    // Pickup address
    doc.text(10, 62, 'Pickup Address:');
    doc.text(20, 70, `${data.pickup_address.name}`);
    doc.text(20, 78, `${data.delivery_address?.nearby} ${data.pickup_address.house}, ${data.pickup_address.area}, ${data.pickup_address.city}, ${data.pickup_address.pincode}`);
    doc.text(20, 86, `Mobile: +91-${data.pickup_address.mobile}`);

    // Delivery address
    doc.text(10, 100, 'Delivery Address:');
    doc.text(20, 108, `${data.delivery_address.name}`);
    doc.text(20, 116, `${data.delivery_address?.nearby} ${data.delivery_address.house}, ${data.delivery_address.area}, ${data.delivery_address.city}, ${data.delivery_address.pincode}`);
    doc.text(20, 124, `Mobile: +91-${data.delivery_address.mobile}`);


    //   get arr of services
    function servicesArr(item) {
        return item?.services?.map(service => " " + service.name)?.toString();
    }
    // let servicesArr = data?.items?.services?.map(service => service?.name).join();
    // Items table
    let y = 140;
    doc.autoTable({
        startY: y,
        head: [['Item', 'Service', 'Quantity']],
        body: data.items.map(item => [`${item.name} (${item.gender.toUpperCase()})`, `${servicesArr(item)}`, item.quantity])
    });

    // Addons
    if (data.addons && data.addons.length > 0) {
        y = doc.autoTable.previous.finalY + 10;
        data.addons?.forEach(addon => {
            y += 10;
            doc.text(10, y, `${addon.name}: ${currencyIcon} ${addon.price}`);
        });
        y += 10;
    }

    // Service fee and total amount
    if (data.addons && data.addons.length > 0) {
        // data.addons && data.addons.length > 0
    } else {
        y = doc.autoTable.previous.finalY + 20;
    }
    doc.text(10, y, `Service Fee: ${currencyIcon} ${data.service_fee}`);
    y += 10;

    //   Sub Total
    if (data?.amount <= 0) {

    } else {
        // y += 10
        doc.text(10, y, `Sub Total: ${currencyIcon} ${data.service_fee}`);
        y += 10
        doc.text(10, y, `Total Amount: ${currencyIcon} ${totalAmount}`);
    }

}





export function showInvoice(action, details, payments) {
    let doc = new jsPDF();

    editPdf(doc, details, payments);

    if (action === 'print') {
        doc.autoPrint();
        //This is a key for printing
        window.open(
            doc.output('dataurlnewwindow'),
            '_blank'
        );
        // const pdfContent = doc.output('blob');
        // showInBlob(pdfContent, doc);
        return;
    }

    if (action === 'download') {
        doc.save(`invoice_${details?.order_id}.pdf`);
        return;
    }
}

function showInBlob(pdfContent, doc) {
    // Create a Blob from the PDF content
    const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });

    // Create a URL for the Blob
    const blobUrl = URL.createObjectURL(pdfBlob);

    doc.autoPrint();
    // Open the URL in a new tab/window
    window.open(blobUrl);
}