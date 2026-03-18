import HubPage from './HubPage';

// ... other imports

<Routes>
  <Route path="/swap" component={SwapPage} />
  <Route path="/stake" component={StakePage} />
  <Route path="/airdrop" component={AirdropPage} />
  <Route path="/hub/:id" component={HubPage} />
  <Route component={NotFound} />
</Routes>