pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;
import "./ownable.sol";

contract HappyAlliance is Ownable {

	struct Donation {
  	// Do not record details in the blockchain
  	string donationId; // donation Id
  	string memberId; // member Id
		string openInfo; // information that a member agrees to open
  }

  Donation[] public donations; // donation array
  mapping (string => string[]) memberToDonations;

  struct Box {
    string boxId; // box Id
    string boxType; // box type such as KIDS
    string generatedYear; // year that a box is generated
    string serializedDonationsDetails; // originally string[] donationIds;
    string expirationDate; // expiration date obtained from the minimum value out of donations
    string npoInfo; // npo information
    string npoReceivedTime; // check whether the npo receives
    string recipientInfo; // information about last recipients
    string recipientReceivedTime; // check whether the recipient receives
  }

  Box[] public boxes; // box array

  mapping (string => uint) yearlyCounts;
  mapping (string => string) boxToNPO;
  mapping (string => string[]) npoToBoxIds;
  mapping (string => uint) boxIdToIdx;
  mapping (string => string[]) historyOfBox; // record whole destination history

  string[] public boxIdList; // list of box ids
	string[] public boxTypes; // list of box types

  uint[] public boxStatus;

  constructor () public {
    // initialize the first box of which id is "test"
    distributeBox("initialize", "undefined", "undefined", '[{"undefined": ""}]', "null", "undefined");
    boxStatus[0] = 99;
    donate("initialize", "noname", "noInfo");
  }

  function donate (string _donationId, string _memberId, string _openInfo) public {
  	Donation memory tmpDonation;
  	tmpDonation.donationId = _donationId;
  	tmpDonation.memberId = _memberId;
		tmpDonation.openInfo = _openInfo;
    donations.push(tmpDonation);
  	memberToDonations[_memberId].push(_donationId);
  }

  function distributeBox (string _boxId, string _boxType, string _year, string _serializedDonationsDetails, string _expirationDate, string _npo) public {
    Box memory tmpBox;
    tmpBox.boxId = _boxId;
    tmpBox.boxType = _boxType;
    tmpBox.generatedYear = _year;
    tmpBox.serializedDonationsDetails = _serializedDonationsDetails;
    tmpBox.expirationDate = _expirationDate;
    tmpBox.npoInfo = _npo;
    tmpBox.npoReceivedTime = '';
    tmpBox.recipientInfo = '';
    tmpBox.recipientReceivedTime = '';

    boxes.push(tmpBox);
    boxStatus.push(0);

    boxToNPO[_boxId] = _npo;
    npoToBoxIds[_npo].push(_boxId);
    boxIdToIdx[_boxId] = boxes.length - 1;
    historyOfBox[_boxId].push(_npo);
    boxIdList.push(_boxId);
		boxTypes.push(_boxType);
    yearlyCounts[_year]++;
  }

	// confirm that a npo receives a box
  function receiveBox (string _boxId, string _time) public {
    boxes[boxIdToIdx[_boxId]].npoReceivedTime = _time;
    if(boxStatus[boxIdToIdx[_boxId]]<=1){
      boxStatus[boxIdToIdx[_boxId]] = 1;
    }
  }

	function addInfo (string _boxId, string _recipientInfo, string _time) public {
    boxes[boxIdToIdx[_boxId]].recipientInfo = _recipientInfo;
    boxes[boxIdToIdx[_boxId]].recipientReceivedTime = _time;
    boxStatus[boxIdToIdx[_boxId]] = 2;
    historyOfBox[_boxId].push(_recipientInfo);
  }

  // return all box ids;
  function getBoxIds () public view returns(string[]){
    return boxIdList;
  }

	// return box types;
	function getBoxTypes () public view returns(string[]){
    return boxTypes;
  }

  // return the received history of a box
  function getHistoryOfBox (string _boxId) public view returns(string[]){
    return historyOfBox[_boxId];
  }



  // After a recipient receives the box and notifies this update to SK


  function getStatusForAll () public view returns (uint[]) {
    return boxStatus;
  }

  // check box information
  function viewBoxInformation (string _boxId) public view returns(string, string, string, string, string, string){
    //require(boxes[boxIdToIdx[_boxId]].received == true, "NPO does not receive the box yet.");
    Box memory targetBox = boxes[boxIdToIdx[_boxId]];
    return (_boxId, targetBox.serializedDonationsDetails, targetBox.npoInfo, targetBox.npoReceivedTime, targetBox.recipientInfo, targetBox.recipientReceivedTime);
  }

  // mapping box id to index in 'boxes' array
  function getIndexByBoxId (string _boxId) public view returns (uint) {
    return boxIdToIdx[_boxId];
  }

  // get number of boxes by year
  function getNumBoxesByYear (string _year) public view returns (uint) {
    return yearlyCounts[_year];
  }

  function getBoxInfoByNPO (string _npo) public view returns (string[], string[], string[], string[], string[], string[]) {
    string[] memory tmp = npoToBoxIds[_npo];

    string[] memory list1 = new string[](tmp.length);
    string[] memory list2 = new string[](tmp.length);
    string[] memory list3 = new string[](tmp.length);
    string[] memory list4 = new string[](tmp.length);
    string[] memory list5 = new string[](tmp.length);
    string[] memory list6 = new string[](tmp.length);

    for(uint i=0; i<tmp.length; i++){
      list1[i] = boxes[boxIdToIdx[tmp[i]]].boxId;
      list2[i] = boxes[boxIdToIdx[tmp[i]]].boxType;
      list3[i] = boxes[boxIdToIdx[tmp[i]]].serializedDonationsDetails;
      list4[i] = boxes[boxIdToIdx[tmp[i]]].npoReceivedTime;
      list5[i] = boxes[boxIdToIdx[tmp[i]]].recipientInfo;
      list6[i] = boxes[boxIdToIdx[tmp[i]]].recipientReceivedTime;
    }
    return (list1, list2, list3, list4, list5, list6);
  }

	function getAllBoxInfo () public view returns (string[], string[], string[], string[]){
		string[] memory boxIds = getBoxIds();
		string[] memory types = new string[](boxIds.length);
		string[] memory donations = new string[](boxIds.length);
		string[] memory npos = new string[](boxIds.length);
		for(uint i=0; i<boxIds.length; i++){
			types[i] = boxes[boxIdToIdx[boxIds[i]]].boxType;
			donations[i] = boxes[boxIdToIdx[boxIds[i]]].serializedDonationsDetails;
			npos[i] = boxes[boxIdToIdx[boxIds[i]]].npoInfo;
		}
		return (boxIds, types, donations, npos);
	}

}
