import React from "react"
import { Select } from "antd"
import { ListingFilter } from "../../../../lib/graphql/globalTypes"

interface Props{
    filter: ListingFilter
    setFilter: (filter: ListingFilter) => void
}

const { Option } = Select

export const ListingsFilters = ({filter, setFilter}: Props) => {
    return (
        <div className="listings-filters">
            <span>Filter By</span>
            <Select value={filter} onChange={(filter:ListingFilter) => setFilter(filter)}>
                <Option value={ListingFilter.PRICE_LOW_TO_HIGH}>Price: Low to High</Option>
                <Option value={ListingFilter.PRICE_HIGH_TO_LOW}>Price: High to Low</Option>
            </Select>
        </div>
    )
}