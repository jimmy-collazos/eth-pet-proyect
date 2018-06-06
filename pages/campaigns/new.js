import React, { Component } from 'react';
import Layout from '../../components/Layout';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';

export default class CampaignNew extends Component {
  state = {
    minimunContribution: '',
    errorMessage: '',
    loading: false
  }
  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true});

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaing(this.state.minimunContribution)
        .send({
          from: accounts[0]
        });
      Router.pushRoute('/');
    } catch (err) {
      this.setState({errorMessage: err.message})
    }
    this.setState({loading: false, minimunContribution: ''});
  }
  render() {
    return (<Layout>
      <h1>New Campaign</h1>
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>
            Minimun Contribution
          </label>
          <Input
            label="wei"
            labelPosition="right"
            value={this.state.minimunContribution}
            onChange={event => this.setState({minimunContribution: event.target.value})}
            disabled={this.state.loading}
            />
        </Form.Field>
        <Message
          error
          header='Oops!'
          content={this.state.errorMessage} />
        <Button loading={this.state.loading} primary >Create!</Button>
      </Form>
    </Layout>)
  }
}