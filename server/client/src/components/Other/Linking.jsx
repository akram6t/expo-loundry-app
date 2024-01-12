import { Link } from "react-router-dom";

const Linking = ({data, currentPage='pageName'}) => {
    return(
        <div className="font-semibold flex items-center space-x-2">
            {
                data.map((item, index) => {
                        return<>
                            <Link key={index} className="text-emerald-600" to={item.route}>{item.name}</Link>
                            <span className="text-xl">/</span>
                        </>
                    
                })
            }
            <span>{ currentPage }</span>
        </div>
    )
}

export default Linking;