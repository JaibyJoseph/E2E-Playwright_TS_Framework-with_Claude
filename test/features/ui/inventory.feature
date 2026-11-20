@ui
Feature: Product sorting
  As a shop user
  I want to sort the product list
  So that I can find products faster

  Background:
    Given I am on the login page
    And I log in as "standardUser"

  Scenario Outline: Products are sorted by <sort>
    When I sort the products by "<sort>"
    Then the products should be sorted by "<sort>"

    Examples:
      | sort      |
      | nameAsc   |
      | nameDesc  |
      | priceAsc  |
      | priceDesc |
