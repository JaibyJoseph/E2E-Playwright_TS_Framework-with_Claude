@api
Feature: Posts API

  @smoke
  Scenario: Fetch a single post
    When I send a "GET" request to "/posts/1"
    Then the response status should be 200
    And the response field "id" should equal "1"

  Scenario: Create a post from test data
    When I send a "POST" request to "/posts" with payload "createPost"
    Then the response status should be 201
    And the response body should contain the request payload

  Scenario: Fetch posts for a user through the service layer
    When I fetch posts for user 1
    Then the response status should be 200
    And every post should belong to user 1
