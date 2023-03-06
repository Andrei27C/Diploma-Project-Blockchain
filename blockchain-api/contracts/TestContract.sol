pragma solidity ^0.7.4;

pragma experimental ABIEncoderV2;

/**
 ***SPDX-License-Identifier: UNLICENSED
 **/

import "./DateTime.sol";

contract TestContract{
    uint256 number;

    constructor(uint256 _number) {
        number = _number;
    }

    function setNumber(uint256 _number) public returns (uint256){
        if(_number % 2 == 0) {
            number += _number * 2;
        } else {
            number += _number;
        }
        return number;
    }

    function getNumber() public view returns(uint256){
        return number;
    }

}