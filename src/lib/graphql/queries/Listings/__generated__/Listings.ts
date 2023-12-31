/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListingFilter } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Listings
// ====================================================

export interface Listings_listings_result {
  __typename: "Listing";
  id: string;
  title: string;
  image: string;
  price: number;
  address: string;
  numOfGuests: number;
}

export interface Listings_listings {
  __typename: "Listings";
  region: string | null;
  total: number;
  result: Listings_listings_result[];
}

export interface Listings {
  listings: Listings_listings;
}

export interface ListingsVariables {
  location?: string | null;
  filter?: ListingFilter | null;
  limit: number;
  page: number;
}
