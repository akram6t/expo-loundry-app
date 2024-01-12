import { oneYearAgo, sevenDaysAgo, thirtyDaysAgo, today, yesterday } from "../utils/DateFilter"

const filterDate = [
    {label: 'Today', value: today},
    {label: 'Yesterday', value: yesterday},
    {label: 'Last 7 Days', value: sevenDaysAgo},
    {label: 'Last Month', value: thirtyDaysAgo},
    {label: 'Last Year', value: oneYearAgo}
]

export default filterDate