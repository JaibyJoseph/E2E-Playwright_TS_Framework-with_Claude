@ui
Feature: Login
  As a shop user
  I want to log in
  So that I can browse products

  Background:
    Given I am on the login page

  @smoke
  Scenario: Successful login shows the products page
    When I log in as "standardUser"
    Then I should see the products page

  Scenario Outline: Login is rejected for <user>
    When I log in as "<user>"
    Then I should see the login error "<error>"

    Examples:
      | user          | error       |
      | lockedOutUser | lockedOut   |
      | unknownUser   | noMatch     |
