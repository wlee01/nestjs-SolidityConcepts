// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SolidityConcepts {
    uint256 public constant FIXED_VALUE = 100;
    address public immutable owner;
    uint256 public value = 50;

    event ValueChanged(uint256 oldValue, uint256 newValue);

    constructor() {
        owner = msg.sender;
    }

    function checkValue(uint256 input) public pure returns (string memory) {
        if (input > 100) {
            return "Value is greater than 100";
        } else if (input == 100) {
            return "Value is exactly 100";
        } else {
            return "Value is less than 100";
        }
    }

    function sumUpTo(uint256 input) public pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 1; i <= input; i++) {
            sum += i;
        }
        return sum;
    }

    function updateValue(uint256 newValue) public {
        uint256 oldValue = value;
        value = newValue;
        emit ValueChanged(oldValue, newValue);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function ownerFunction() public view onlyOwner returns (string memory) {
        return "Hello, Owner!";
    }

    // receive 함수: 컨트랙트가 직접 이더를 받을 수 있도록 설정
    receive() external payable {}

    // 이더 송금 함수
    function sendEther(address payable recipient) public payable {
        require(msg.value > 0, "Must send ether");
        recipient.transfer(msg.value);
    }

    // 컨트랙트의 현재 잔액 반환
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // 소유자가 컨트랙트에서 이더 전액 출금
    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
