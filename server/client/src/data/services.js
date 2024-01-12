export const servicesHeader = [
    {
        key: "serial_number",
        label: "s No.",
    },
    {
        key: "service_image",
        label: "Service Image",
    },
    {
        key: "service_name",
        label: "Service Name",
    },
    {
        key: "service_types",
        label: "Service Types",
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

export const genders = ["Man", "Woman", "Kids", "Others"];

export const servicesTypesHeader = [
    {
        key: 'serial_number',
        label: 's NO.'
    },
    {
        key: 'image',
        label: 'Image'
    },
    {
        key: 'name',
        label: 'Name'
    },
    {
        key: 'color',
        label: 'Color'
    },
    {
        key: 'status',
        label: 'Status'
    },
    {
        key: 'action',
        label: 'Action'
    },
]

export const servicesTypesData = [
    {
        _id: "6544aebcb8e7b5ebbd1a9cbe",
        image: "/icons/washonly.png",
        name: "Wash Only",
        color: "#feffeC",
        status: 'Active'
    },
    {
        _id: "6544af41b8e7b5ebbd1a9cbf",
        image: "/icons/irononly.png",
        name: "Iron Only",
        color: "#EBFFEC",
        status: 'Active'
    },
    {
        _id: "6544afccb8e7b5ebbd1a9cc1",
        image: "/icons/dryclean.png",
        name: "Dry Clean",
        color: "#EFFEFF",
        status: 'Active'
    },
    {
        _id: "65724bf4e0cb4bbbafa40593",
        image: "/icons/washandiron.png",
        name: "Wash & Iron",
        color: "#EBFFCB",
        status: 'Active'
    },
];

export const servicesData = [
    {
        _id: "654483a03dd85806ea9f6a4b",
        image: "https://cdn-icons-png.flaticon.com/128/4643/4643574.png",
        name: "shirt",
        quantity: 0,
        gender: "men",
        services: [
            { name: "Wash Only", price: 10 },
            { name: "Iron Only", price: 10 },
            { name: "Dry Clean", price: 25 },
        ],
        shopid: "65442ccd8674edea93aa8587",
        status: 'Active'
    },
    {
        _id: "654483a03dd85806ea9f6a4c",
        image: "https://cdn-icons-png.flaticon.com/128/892/892458.png",
        name: "T-shirt",
        quantity: 0,
        gender: "man",
        services: [
            { name: "Wash Only", price: 10 },
            { name: "Iron Only", price: 10 },
            { name: "Dry Clean", price: 25 },
        ],
        shopid: "65442ccd8674edea93aa8587",
        status: 'Active'
    },
    {
        _id: "654483a03dd85806ea9f6a4d",
        image: "https://cdn-icons-png.flaticon.com/128/9609/9609161.png",
        name: "dresses",
        gender: "women",
        quantity: 0,
        services: [
            { name: "Wash Only", price: 10 },
            { name: "Iron Only", price: 10 },
            { name: "Dry Clean", price: 25 },
        ],
        shopid: "65442ccd8674edea93aa8587",
        status: 'Active'
    },
    {
        _id: "654483a03dd85806ea9f6a4e",
        image: "https://cdn-icons-png.flaticon.com/128/599/599388.png",
        name: "jeans",
        quantity: 0,
        gender: "men",
        services: [
            { name: "Wash Only", price: 10 },
            { name: "Iron Only", price: 10 },
            { name: "Dry Clean", price: 25 },
        ],
        shopid: "65442ccd8674edea93aa8587",
        status: 'Inactive'
    },
    {
        _id: "654483a03dd85806ea9f6a4f",
        image: "https://cdn-icons-png.flaticon.com/128/9431/9431166.png",
        name: "Sweater",
        quantity: 0,
        gender: "women",
        services: [
            { name: "Wash Only", price: 10 },
            { name: "Iron Only", price: 10 },
            { name: "Dry Clean", price: 25 },
        ],
        shopid: "65442ccd8674edea93aa8587",
        status: 'Inactive'
    },
    {
        _id: "654483a03dd85806ea9f6a50",
        image: "https://cdn-icons-png.flaticon.com/128/3345/3345397.png",
        name: "shorts",
        quantity: 0,
        gender: "women",
        services: [
            { name: "Wash Only", price: 10 },
            { name: "Iron Only", price: 10 },
            { name: "Dry Clean", price: 25 },
        ],
        shopid: "65442ccd8674edea93aa8587",
        status: 'Active'
    },
    {
        _id: "654483a03dd85806ea9f6a51",
        image: "https://cdn-icons-png.flaticon.com/128/293/293241.png",
        name: "Sleeveless",
        quantity: 0,
        gender: "women",
        services: [
            { name: "Wash Only", price: 10 },
            { name: "Iron Only", price: 10 },
            { name: "Dry Clean", price: 25 },
        ],
        shopid: "65442ccd8674edea93aa8587",
        status: 'Inactive'
    },
];
