import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import {Link} from '../../../routes'
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

  static async getInitialProps(props) {
    const {address} = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const summary = await campaign.methods.getSummary().call();
    const approversCount = summary[3];
    
    const fillRequest = (element, index) => campaign.methods.requests(index).call()
    const requests = await Promise.all(
      Array(+requestCount).fill().map(fillRequest)
    );

    return {
      address,
      requests,
      requestCount,
      approversCount
    }
  }

  renderRows(request) {
    return this.props.requests.map((request, index) => {
      return <RequestRow
        key={index}
        id={index}
        request={request}
        address={this.props.address}
        requestCount= {this.props.requestCount}
        approversCount= {this.props.approversCount}
      />
    })
  }

  render () {
    const {Header, Row, HeaderCell, Body } = Table
    return (
      <Layout>
        <h3>Request List</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>
        <Table celled>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>
            {this.renderRows()}
          </Body>
        </Table>
      </Layout>
    )
  }
}

export default RequestIndex;