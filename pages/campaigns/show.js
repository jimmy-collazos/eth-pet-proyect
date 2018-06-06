import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import {Link} from '../../routes'


export default class CampaignShow extends Component {

  static async getInitialProps (props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    return {
      address: props.query.address,
      minimunContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4]
     };
  }

  renderCards () {
    const {
      minimunContribution,
      balance,
      requestsCount,
      approversCount,
      manager
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Addresss of Manager',
        description: 'The manager created this campaign and can create requests to withdraw money',
        style: {
          overflowWrap: 'break-word'
        }
      },
      {
        header: minimunContribution,
        meta: 'Minimun Contribution (wei)',
        description: 'You must contribute at least this much wei to become approver'
      },
      {
        header: requestsCount,
        meta: 'Numbers of Requests',
        description: 'A request tries to withdraw money from the contract. Requests must be appoved by approvers'
      },
      {
        header: approversCount,
        meta: 'Number of approvers',
        description:  'Number of people who have aŕeady donated to campaign'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'This balance is how much money campaign has left to spend.'

      }
    ];

    return <Card.Group items={items} />;
  }

  render () {
    return (
      <Layout>
        <h3>Cmpaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={11}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={5}>
              <ContributeForm address={this.props.address}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>


        </Grid>


      </Layout>
    );
  }
}