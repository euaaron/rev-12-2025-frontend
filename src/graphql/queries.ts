import { gql } from "@apollo/client";

export const GET_CARS = gql`
  query GetCars(
    $year: Int
    $make: String
    $model: String
    $color: String
    $sortBy: String
    $sortDir: String
    $page: Int!
    $pageSize: Int!
    $isDesktop: Boolean!
    $isTablet: Boolean!
    $isMobile: Boolean!
  ) {
    carsPage(
      make: $make
      year: $year
      model: $model
      color: $color
      sortBy: $sortBy
      sortDir: $sortDir
      page: $page
      pageSize: $pageSize
    ) {
      totalCount
      items {
        id
        make
        model
        year
        color
        desktop @include(if: $isDesktop)
        tablet @include(if: $isTablet)
        mobile @include(if: $isMobile)
      }
    }
  }
`;

export const CREATE_CAR = gql`
  mutation AddNewCar($params: CarInput!) {
    createCar(params: $params) {
      id
      make
      model
      year
      color
      mobile
      tablet
      desktop
    }
  }
`;
