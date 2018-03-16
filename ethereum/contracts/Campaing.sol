pragma solidity ^0.4.18;

contract CampaingFactory {
    address[] public deployedCampaings;
    
    function createCampaing(uint minimun) public {
        address newCampaing = new Campaing(minimun, msg.sender);
        deployedCampaings.push(newCampaing);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaings;
    }
}

contract Campaing {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    Request[] public requests;
    address public manager;
    uint public mininumContribution;
    mapping(address => bool) public approvers;
    uint approversCount;
    
    
     modifier restricted() {
        require(msg.sender == manager);
        _;
    } 
    
    function Campaing (uint minimun, address creator) public {
        manager = creator;
        mininumContribution = minimun;
    }
    
    function contribute() public payable {
        require(msg.value > mininumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description: description, 
            value: value, 
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }
    
    function approveRequest (uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(request.approvalCount > (approversCount /2));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }
    
}