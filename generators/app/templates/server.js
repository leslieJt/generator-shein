<% if (template.interfaces && template.interfaces.length === 1) { _%>
/* eslint-disable import/prefer-default-export */
<%_ } _%>
import fetch from 'lib/fetch';
import { encodeQuery } from 'lib/query-string';

<% if (template.interfaces) { %>
  const <%= subDirectory %> = {
    <%_ template.interfaces.forEach(i => { _%>
     <%= i.name %>: '<%= i.url %>',
    <%_ }) _%>
  }

  <% template.interfaces.forEach(i => { %>
    export const <%= i.name %> = <% if (i.keys && i.keys.length) { %>
      filter => {
        const keys = [
          <% i.keys.forEach(k => { %>
          '<%= k %>',
          <% }) %>
        ];
        return fetch(`${<%= subDirectory + '.' + i.name %>}?${encodeQuery(keys, filter)}`, {
          method: 'get'
        });
      }
    <% } else { %>
      () =>
          fetch(`${<%= subDirectory + '.' + i.name %>}`, {
            method: 'get'
          });
    <% } %>
  <% }) %>
<% } %>