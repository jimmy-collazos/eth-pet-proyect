import React, { Component } from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Router, Link} from '../../../routes';

class RequestNew extends Component {
  state = {
    address: '',
    description: 'asdasds',
    value: '1',
    recipient: '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
    errorMessage: '',
    loading: false
  }

  static async getInitialProps(props) {
    const {address} = props.query;

    return {
      address
    }
  }

  onSubmit = async event => {
    event.preventDefault();
    this.setState({loading: true});

    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.createRequest(
        description,
        web3.utils.toWei(value, 'ether'),
        recipient
      ).send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${this.props.address}/requests`)
    } catch (err) {
      this.setState({errorMessage: err.message})
    }
    this.setState({
      address: '',
      description: '',
      value: '',
      recipient: '',
      errorMessage: '',
      loading: false
    });
  }

  render () {
    <h1>Create a Request</h1>
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>
            Description
          </label>
          <Input
            label="Buy Cases"
            labelPosition="right"
            value={this.state.description}
            onChange={event => this.setState({description: event.target.value})}
            />
        </Form.Field>
        <Form.Field>
          <label>
            Amount in Either
          </label>
          <Input
            label="100"
            labelPosition="right"
            value={this.state.value}
            onChange={event => this.setState({value: event.target.value})}
            />
        </Form.Field>
        <Form.Field>
          <label>
            Recipient
          </label>
          <Input
            label="100"
            labelPosition="right"
            value={this.state.recipient}
            onChange={event => this.setState({recipient: event.target.value})}
            />
        </Form.Field>
        <Message
          error
          header='Oops!'
          content={this.state.errorMessage} />
        <Button loading={this.state.loading} primary >Create!</Button>
      </Form>
      </Layout>
    )
  }
}

export default RequestNew;
