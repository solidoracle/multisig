//SPDX-License-Identifier: MIT
//🔮solidoracle  Scaffold eth multisig challenge
//inspired by Cyril Maranber & Scaffold ETH multisig challenge

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MultiSig {
    using ECDSA for bytes32;

    address public self;
    uint8 public signRequired = 2;

    mapping(address => bool) public isMember;
    address[] members;

    struct Params {
        bytes callData;
        address to;
        uint256 amount;
        uint8 signRequired;
        uint256 txId;
    }

    mapping(uint256 => bool) txSent; //when a txId is receive this mapping is set to true

    event NewSignerEvent(address signer);
    event RemovedSignerEvent(address signer);
    event SigneRequiredEvent(uint8 signerRequired);
    event TxSent(address to, uint256 value, bytes callData);

    modifier onlySelf() { 
        require(msg.sender == self, "not self");
        _;
    }

    constructor() {
        self = address(this);
        isMember[0xc5e92e7f2E1cf916B97DB500587B79Da23FadeB1] = true;
        members.push(0xc5e92e7f2E1cf916B97DB500587B79Da23FadeB1);
        isMember[0x3765f1dfF646C62990d482160C6690Dfb3271616] = true;
        members.push(0x3765f1dfF646C62990d482160C6690Dfb3271616);
        isMember[0x97843608a00e2bbc75ab0C1911387E002565DEDE] = true;
        members.push(0x97843608a00e2bbc75ab0C1911387E002565DEDE); //buidlguidl.eth
    }

    function getHash(
        bytes memory _callData,
        address _to,
        uint256 _amount,
        uint8 _signRequired,
        uint256 _txId
    ) public pure returns (bytes32 _hash) {
        Params memory data;
        data.callData = _callData;
        data.to = _to;
        data.amount = _amount;
        data.signRequired = _signRequired;
        data.txId = _txId;
        return (keccak256(abi.encode(data)));
    }

    function execute(
        bytes calldata _callData,
        address _to,
        uint256 _amount,
        uint8 _signRequired,
        uint256 _txId,
        bytes[] memory signatures
    ) external returns (bytes memory results){
        // require(signatures.length >= signRequired, "not enough signaures !");
        require(txSent[_txId] == false, "transaction allready sent ! ");
        Params memory data;
        data.callData = _callData;
        data.to = _to;
        data.amount = _amount;
        data.signRequired = _signRequired;
        data.txId = _txId;
        bytes32 msgHash = keccak256(abi.encode(data));
        uint8 validSignature = 0;

        for (uint i = 0; i < signatures.length; i++) {
            address recovered = recover(msgHash, signatures[i]);
            if(isMember[recovered]){
                validSignature++;
            }
        }

        require(validSignature>=signRequired, "executeTransaction: not enough valid signatures");
        txSent[_txId] = true; //to avoid to sent the same tx multiple times
        (bool s, bytes memory result) = _to.call{value: _amount}(_callData);
        require (s, "call tx Failed");
        emit TxSent(_to, _amount, _callData);
        return result;
    }

    function recover(bytes32 _hash, bytes memory _signature) public pure returns (address) {
        return _hash.toEthSignedMessageHash().recover(_signature);
    }

    function addSigner(address _newSigner) public onlySelf {
        require(!isMember[_newSigner], 'Signer already fund');
        members.push(_newSigner);
        isMember[_newSigner] = true;
        emit NewSignerEvent(_newSigner);
    }

    function removeSigner(address _Signer) public onlySelf {
        require(isMember[_Signer], 'Signer not fund');

        bool done = false;
        uint8 index;
        for (uint8 i = 0; i < members.length; i++) {
            if (members[i] == _Signer) {
                index = i;
                done = true;
            }
        }

        require(done, "Signer not fund");

        require(members.length > 1, "Last signer can't be removed !");

        for (uint256 i = index; i < members.length - 1; i++) {
            // shifting the element in the array from index to the last
            members[i] = members[i + 1];
        }


        members.pop(); //remove the last entry of the array
        isMember[_Signer] = false;

        if (signRequired > members.length && signRequired > 1) {
            signRequired--;
        } 
        emit RemovedSignerEvent(_Signer);
    }

    function setSignersRequired(uint8 _signRequired) public onlySelf {
        require(_signRequired <= members.length, "Can't have more signers than members");
        signRequired = _signRequired;
        emit SigneRequiredEvent(signRequired);
    }

    function getSigners() public view returns (address[] memory) {
        return members;
    }

    receive()external payable {}

    fallback() external payable {}
}
