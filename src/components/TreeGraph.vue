<template>
  <div>
    <ba-toolbar :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span slot="page-name">360 View</span>
      <div class="options">
        <div class="spacer"></div>
        <div class="option">
          <i class="ba-icon">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="#FFFFFF" d="M23,12L19,8V11H10V13H19V16M1,18V6C1,4.89 1.9,4 3,4H15A2,2 0 0,1 17,6V9H15V6H3V18H15V15H17V18A2,2 0 0,1 15,20H3A2,2 0 0,1 1,18Z" />
            </svg>
          </i>
          <span>Export</span>
        </div>
      </div>
    </ba-toolbar>
    <div :class="['view-container', { maximized }]">
      <svg id="canvas" width="1600" height="800"></svg>
    </div>

    <div class="toast-container">
      <ba-toast ref="errorToast"  @close="navigateBack" position="top">
        <i class="ba-icon ba-alert-circle"></i>
        <span>&nbsp;&nbsp;View Not Yet Available</span>
      </ba-toast>
      <ba-toast ref="beneficiaryToast" position="top">
        <i class="ba-icon ba-alert-circle"></i>
        <span>&nbsp;&nbsp;Client is not a primary on any contracts</span>
      </ba-toast>
    </div>
  </div>
</template>

<script>
  import * as d3 from 'd3';
  import _ from 'lodash';
  import { mapGetters } from 'vuex';
  import sideNav from './mixins/sideNav';
  import RepositoryService from '../services/repositories';

  let svg;
  let width;
  let height;
  let tree;
  let root;

  const diagonal = (s, d) => `M ${s.y} ${s.x} C ${(s.y + d.y) / 2} ${s.x}, ${(s.y + d.y) / 2} ${d.x}, ${d.y} ${d.x}`;

  export default {
    mixins: [sideNav],

    data() {
      return {
        data: {},
        repoData: []
      };
    },

    computed: mapGetters(['links']),

    mounted() {
      RepositoryService.getDocuments({ repoId: '1561795', pageSize: 1000 }).then((response) => {
        this.repoData = _.map(response.body.documents, (d) => {
          return {
            documentId: d.documentId,
            ...d.attributes
          };
        });
        this.setUp({ id: this.$route.params.recordId, type: 'client' });
      });
    },

    methods: {
      setUp(options) {
        this.initData(options);
        this.initView();
      },

      initData(options) {
        const clientObject = _.find(this.repoData, ['SRC_PARTY_ID', options.id]);
        if (clientObject) {
          this.data = this.createClientObject(clientObject);
          this.data.children = _.map(_.filter(this.repoData, c => c.SRC_PARTY_ID === this.data.id), n => this.createContractObject(n, false));
          _.each(this.data.children, (c) => {
            _.each(_.filter(this.repoData, d => d.CNTRT_ID === c.id && d.SRC_PARTY_ID !== this.data.id), (p) => {
              c.children.push(this.createClientObject(p));
            });
          });
        } else {
          const contractObject = _.find(this.repoData, ['CNTRT_ID', options.id]);
          if (contractObject) {
            this.data = this.createContractObject(contractObject);
            this.data.children = _.map(_.filter(this.repoData, c => c.CNTRT_ID === this.data.id), n => this.createClientObject(n, false));
            _.each(this.data.children, (c) => {
              _.each(_.filter(this.repoData, d => d.SRC_PARTY_ID === c.id && d.CNTRT_ID !== this.data.id), (p) => {
                c.children.push(this.createContractObject(p));
              });
              _.each(c.children, (ch) => {
                _.each(_.filter(this.repoData, d => d.CNTRT_ID === ch.id && d.SRC_PARTY_ID !== ch.id), (p) => {
                  ch.children.push(this.createClientObject(p));
                });
              });
            });
          } else {
            this.$refs.errorToast.open();
          }
        }
      },

      initView() {
        d3.selectAll('#canvas > *').remove();
        svg = d3.select('#canvas').append('g').attr('class', 'drawarea');
        width = +d3.select('#canvas').attr('width');
        height = +d3.select('#canvas').attr('height');

        tree = d3.tree().size([height, width]);
        root = d3.hierarchy(this.data, d => d.children);

        this.updateView();

        // Add in pan and zoom
        d3.select('#canvas').call(d3.zoom().on('zoom', () => {
          d3.select('.drawarea').attr('transform', d3.event.transform);
        }));
      },

      changeView(d) {
        if (_.find(this.repoData, rd => rd.SRC_PARTY_ID === d.data.id && rd.CL_CNT_ROLE_CD === 'PI') || _.find(this.repoData, ['CNTRT_ID', d.data.id])) {
          this.setUp({
            id: d.data.id,
            type: d.data.class,
            name: d.data.class === 'client' ? d.data.id : d.data.name
          });
        } else {
          this.$refs.beneficiaryToast.open();
        }
      },

      updateView() {
        const treeData = tree(root);

        const nodes = treeData.descendants();
        const links = treeData.descendants().slice(1);

        nodes.forEach((d) => { d.y = (d.depth * 360) + 200; });

        const clients = svg.selectAll('g.client').data(_.filter(nodes, n => n.data.class === 'client'));
        const contracts = svg.selectAll('g.contract').data(_.filter(nodes, n => n.data.class === 'contract'));

        const clientEnter = clients.enter().append('g').attr('class', 'client');
        const contractEnter = contracts.enter().append('g').attr('class', 'contract');
        const clientTextEnter = clientEnter.append('text')
                                           .attr('dy', '.35em')
                                           .style('transform', d => `translate(${d.y + 100}px, ${d.x - 8}px)`)
                                           .attr('text-anchor', 'middle')
                                           .style('text-transform', 'uppercase')
                                           .text(d => d.data.name)
                                           .style('cursor', 'pointer')
                                           .style('stroke', d => d.data.type === 'pi' ? '#263445' : '#727E7E')
                                           .on('click', this.changeView);
        clientEnter.append('text')
                   .text(d => d.data.type === 'pi' ? 'Primary' : 'Beneficiary')
                   .style('transform', d => `translate(${d.y + 100}px, ${d.x + 12}px)`)
                   .attr('text-anchor', 'middle');

        clientEnter.append('rect')
                   .attr('class', 'client')
                   .attr('height', 36)
                   .attr('rx', 18)
                   .attr('ry', 18)
                   .attr('width', 200)
                   .style('stroke', d => d.data.type === 'pi' ? 'black' : '#727E7E')
                   .style('stroke-width', d => d.data.type === 'pi' ? '3px' : '2px')
                   .style('fill', 'transparent')
                   .style('transform', d => `translate(${d.y}px, ${d.x - 18}px)`)
                   .style('cursor', 'pointer')
                   .on('click', this.changeView);
        clientEnter.append('title').text(d => d.data.id);

        contractEnter.append('circle')
                     .attr('class', 'contract')
                     .attr('r', 58)
                     .style('stroke', 'black')
                     .style('stroke-width', '3px')
                     .style('fill', 'white')
                     .style('transform', d => `translate(${d.y}px, ${d.x}px)`)
                     .style('cursor', 'pointer')
                     .on('click', this.changeView);

        let contractTextEnter = contractEnter.append('text')
                                             .attr('dy', '.35em')
                                             .style('transform', d => `translate(${d.y}px, ${d.x}px)`)
                                             .attr('text-anchor', 'middle')
                                             .style('stroke', '#263445')
                                             .style('cursor', 'pointer')
                                             .text(d => d.data.id)
                                             .on('click', this.changeView);

        const link = svg.selectAll('path.link').data(links);

        const linkEnter = link.enter().insert('path', 'g')
                              .attr('id', d => d.data.id)
                              .attr('class', 'link')
                              .attr('d', (d) => {
                                const p = { x: d.parent.x, y: d.parent.y + (d.parent.data.class === 'client' ? 200 : 0) };
                                const o = { x: d.x, y: d.y };
                                return diagonal(p, o);
                              })
                              .style('fill', 'none')
                              .style('stroke', '#727E7E')
                              .style('stroke-width', '2px');

        // clientTextEnter = clientEnter.append('text')
        //                              .attr('dy', '.35em')
        //                              .style('transform', d => `translate(${d.y + 95}px, ${d.x + 30}px)`)
        //                              .style('stroke', d => d.data.type === 'pi' ? '#263445' : '#727E7E')
        //                              .attr('text-anchor', 'middle')
        //                              .style('text-transform', 'uppercase')
        //                              .text(d => d.data.name);

        contractTextEnter = contractEnter.append('text')
                                         .attr('dy', '.35em')
                                         .style('transform', d => `translate(${d.y}px, ${d.x + 75}px)`)
                                         .style('font-weight', 'bold')
                                         .attr('text-anchor', 'middle')
                                         .style('text-transform', 'uppercase')
                                         .text(d => d.data.name);
      },

      createClientObject(client) {
        return {
          id: client.SRC_PARTY_ID,
          name: `${client.FST_NM} ${client.LST_NM}`,
          type: client.CL_CNT_ROLE_CD.toLowerCase(),
          class: 'client',
          children: []
        };
      },

      createContractObject(contract) {
        return {
          id: contract.CNTRT_ID,
          name: contract.PRD_TP_DESC,
          class: 'contract',
          children: []
        };
      },

      navigateBack() {
        this.$router.push('/dataview');
      }
    }
  };
</script>

<style lang="less" scoped>
  #canvas {
    background: #FFFFFF;
    width: 100%;
    height: ~"calc(100vh - 115px)";
  }

  .spacer {
    flex: 2;
  }

  .options {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    min-width: 100px !important;
  }

  .option {
    color: #FFFFFF;
    padding: 6px 24px;
    cursor: pointer;

    svg {
      transform: translateY(25%);
    }
  }

  .view-container {
    margin-left: 250px;
    transition: all 0.25s;
    width: inherit;

    &.maximized {
      margin-left: 40;
    }

    &.maximize-right {
      margin-right: 0;
    }
  }

  .maximize-enter-active {
    animation: maximize 0.25s;
  }

  .maximize-leave-active {
    animation: minimize 0.25s;
  }

  @keyframes minimize {
    0% {
      margin-left: -250px;
    }
    100% {
      margin-left: 0;
    }
  }

  @keyframes maximize {
    0% {
      margin-left: 0;
    }
    100% {
      margin-left: -250px;
    }
  }
</style>
