const ordersHeader = [
    {
      key: "serial_number",
      label: "S NO.",
    },
    {
      key: "orderinfo",
      label: "Order Info",
    },
    {
      key: "customer",
      label: "Customer",
    },
    {
      key: "order_amount",
      label: "Order Amount",
    },
    {
      key: "payment",
      label: "Payment",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

const ordersData = [
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0025" },
        { key: "Order Date", value: "09 Feb, 2023" },
        { key: "Delivery Date", value: "09 Feb, 2023" }
      ],
      customer: "Kristin Murray",
      amount: 53,
      payment: [
        { key: "Total Amount", value: 54 },
        { key: "Paid Amount", value: 10 }
      ],
      status: {
        status: 'Pending',
        color: 'red'
      },
    },
    // Item 2
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0026" },
        { key: "Order Date", value: "10 Feb, 2023" },
        { key: "Delivery Date", value: "10 Feb, 2023" }
      ],
      customer: "John Doe",
      amount: 65,
      payment: [
        { key: "Total Amount", value: 70 },
        { key: "Paid Amount", value: 20 }
      ],
      status: {
        status: 'Shipped',
        color: 'green'
      },
    },
    // Item 3
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0027" },
        { key: "Order Date", value: "11 Feb, 2023" },
        { key: "Delivery Date", value: "12 Feb, 2023" }
      ],
      customer: "Alice Johnson",
      amount: 75,
      payment: [
        { key: "Total Amount", value: 80 },
        { key: "Paid Amount", value: 25 }
      ],
      status: {
        status: 'Delivered',
        color: 'blue'
      },
    },
    // Item 4
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0028" },
        { key: "Order Date", value: "13 Feb, 2023" },
        { key: "Delivery Date", value: "14 Feb, 2023" }
      ],
      customer: "Bob Smith",
      amount: 90,
      payment: [
        { key: "Total Amount", value: 95 },
        { key: "Paid Amount", value: 30 }
      ],
      status: {
        status: 'Shipped',
        color: 'green'
      },
    },
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0025" },
        { key: "Order Date", value: "09 Feb, 2023" },
        { key: "Delivery Date", value: "09 Feb, 2023" }
      ],
      customer: "Kristin Murray",
      amount: 53,
      payment: [
        { key: "Total Amount", value: 54 },
        { key: "Paid Amount", value: 10 }
      ],
      status: {
        status: 'Pending',
        color: 'red'
      },
    },
  
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0025" },
        { key: "Order Date", value: "09 Feb, 2023" },
        { key: "Delivery Date", value: "09 Feb, 2023" }
      ],
      customer: "Kristin Murray",
      amount: 53,
      payment: [
        { key: "Total Amount", value: 54 },
        { key: "Paid Amount", value: 10 }
      ],
      status: {
        status: 'Pending',
        color: 'red'
      },
    },
    // Item 5
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0029" },
        { key: "Order Date", value: "15 Feb, 2023" },
        { key: "Delivery Date", value: "16 Feb, 2023" }
      ],
      customer: "Eva Williams",
      amount: 80,
      payment: [
        { key: "Total Amount", value: 85 },
        { key: "Paid Amount", value: 40 }
      ],
      status: {
        status: 'Delivered',
        color: 'blue'
      },
    },
    // Item 6
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0030" },
        { key: "Order Date", value: "17 Feb, 2023" },
        { key: "Delivery Date", value: "18 Feb, 2023" }
      ],
      customer: "Samuel Turner",
      amount: 95,
      payment: [
        { key: "Total Amount", value: 100 },
        { key: "Paid Amount", value: 50 }
      ],
      status: {
        status: 'Shipped',
        color: 'green'
      },
    },
    // Item 7
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0031" },
        { key: "Order Date", value: "19 Feb, 2023" },
        { key: "Delivery Date", value: "20 Feb, 2023" }
      ],
      customer: "Sophia Rodriguez",
      amount: 110,
      payment: [
        { key: "Total Amount", value: 120 },
        { key: "Paid Amount", value: 60 }
      ],
      status: {
        status: 'Pending',
        color: 'red'
      },
    },
    // Item 8
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0032" },
        { key: "Order Date", value: "21 Feb, 2023" },
        { key: "Delivery Date", value: "22 Feb, 2023" }
      ],
      customer: "Daniel Miller",
      amount: 75,
      payment: [
        { key: "Total Amount", value: 80 },
        { key: "Paid Amount", value: 30 }
      ],
      status: {
        status: 'Delivered',
        color: 'blue'
      },
    },
  
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0025" },
        { key: "Order Date", value: "09 Feb, 2023" },
        { key: "Delivery Date", value: "09 Feb, 2023" }
      ],
      customer: "Kristin Murray",
      amount: 53,
      payment: [
        { key: "Total Amount", value: 54 },
        { key: "Paid Amount", value: 10 }
      ],
      status: {
        status: 'Pending',
        color: 'red'
      },
    },
    {
      orderinfo: [
        { key: "Order Id", value: "ORD-0025" },
        { key: "Order Date", value: "09 Feb, 2023" },
        { key: "Delivery Date", value: "09 Feb, 2023" }
      ],
      customer: "Kristin Murray",
      amount: 53,
      payment: [
        { key: "Total Amount", value: 54 },
        { key: "Paid Amount", value: 10 }
      ],
      status: {
        status: 'Pending',
        color: 'red'
      },
    },
    {
      "orderinfo": [
        {
          "key": "Order Id",
          "value": "0237548923"
        },
        {
          "key": "Order Date",
          "value": "2023-08-17T08:26:47.641Z"
        },
        {
          "key": "Delivery Date",
          "value": "2023-04-28T02:13:32.956Z"
        }
      ],
      "customer": "Sophia Hernandez",
      "amount": 152.32,
      "payment": [
        {
          "key": "Total Amount",
          "value": 242.17
        },
        {
          "key": "Paid Amount",
          "value": 89.85
        }
      ],
      "status": {
        "status": "Shipped",
        "color": "#a3f09b"
      }
    },
    {
      "orderinfo": [
        {
          "key": "Order Id",
          "value": "8347201569"
        },
        {
          "key": "Order Date",
          "value": "2023-10-14T19:42:01.768Z"
        },
        {
          "key": "Delivery Date",
          "value": "2023-07-05T12:48:22.807Z"
        }
      ],
      "customer": "Eleanor Perry",
      "amount": 24.99,
      "payment": [
        {
          "key": "Total Amount",
          "value": 62.87
        },
        {
          "key": "Paid Amount",
          "value": 37.88
        }
      ],
      "status": {
        "status": "Delivered",
        "color": "#82e2c5"
      }
    },
    {
      "orderinfo": [
        {
          "key": "Order Id",
          "value": "X1234567890"
        },
        {
          "key": "Order Date",
          "value": "2023-11-28"
        },
        {
          "key": "Delivery Date",
          "value": "2023-09-23"
        }
      ],
      "customer": "Eleanor Lawson",
      "amount": 87.32,
      "payment": [
        {
          "key": "Total Amount",
          "value": 42.13
        },
        {
          "key": "Paid Amount",
          "value": 31.88
        }
      ],
      "status": {
        "status": "Cancelled",
        "color": "#e25f5f"
      }
    },
    {
      "orderinfo": [
        {
          "key": "Order Id",
          "value": "R5432178906"
        },
        {
          "key": "Order Date",
          "value": "2023-03-21"
        },
        {
          "key": "Delivery Date",
          "value": "2023-05-17"
        }
      ],
      "customer": "Joseph Campbell",
      "amount": 938.12,
      "payment": [
        {
          "key": "Total Amount",
          "value": 987.21
        },
        {
          "key": "Paid Amount",
          "value": 49.09
        }
      ],
      "status": {
        "status": "Pending",
        "color": "#ff9900"
      }
    },
  ];

  export { ordersData, ordersHeader };