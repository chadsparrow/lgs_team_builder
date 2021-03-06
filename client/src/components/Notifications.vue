<template>
  <div class="navItem" v-if="notificationsReady">
    <button class="small-btn" @click="showNotifications = !showNotifications">
      <i class="fas fa-envelope fa-lg"></i>
      <span class="badge badge-danger ml-2" v-if="notifications.length > 0">{{
        notifications.length
      }}</span>
      <span class="badge badge-info ml-2" v-else>{{
        notifications.length
      }}</span>
    </button>
    <ul class="notificationsList list-group" v-if="showNotifications">
      <li
        class="list-group-item list-group-item-action list-group-item-empty"
        v-if="notifications.length === 0"
      >
        {{ $t('notifications.none') }}
      </li>
      <li
        class="list-group-item list-group-item-action"
        v-for="notification of notifications"
        :key="notification._id"
      >
        <div class="notification">
          <div>
            <small class="text-muted">
              {{
                notification.date
                  | moment(
                    'timezone',
                    loggedInMember.timezone,
                    'MMM Do YYYY / hh:mm a - z'
                  )
              }}
            </small>
          </div>
          <div>{{ notification.message }}</div>
        </div>
        <button
          class="small-btn danger-btn"
          @click="deleteNotification(notification._id)"
        >
          <i class="fas fa-times"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import toast from '../helpers/toast';
import get from 'lodash/get';

export default {
  name: 'Notifications',
  data() {
    return {
      showNotifications: false,
      polling: null,
    };
  },
  computed: {
    ...mapGetters(['loggedInMember', 'notifications', 'notificationsReady']),
  },
  created: async function() {
    try {
      await this.$store.dispatch('getMe', this.loggedInMember.aud);
      this.getNotifications();
      this.$store.dispatch('setNotificationsReadyTrue');
    } catch (err) {
      toast.error(err);
      this.$store.dispatch('setNotificationsReadyTrue');
    }
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
    this.$store.dispatch('setNotificationsReadyFalse');
  },
  methods: {
    getNotifications: function() {
      this.polling = setInterval(async () => {
        try {
          await this.$store.dispatch('getMe', this.loggedInMember.aud);
        } catch (err) {
          toast.error(err);
        }
      }, 60000 * 10);
    },
    deleteNotification: async function(nId) {
      try {
        const res = await this.$store.dispatch('removeNotification', { nId });
        await this.$store.dispatch('getMe', this.loggedInMember.aud);
        toast.success(get(res, 'data[0].message', 'Success'));
      } catch (err) {
        toast.error(err);
      }
    },
    clickTo: function(clickTo) {
      this.$router.push(clickTo);
    },
  },
};
</script>

<style lang="scss" scoped>
.navItem {
  position: relative;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    line-height: 32px;
    padding: 0.4rem;
  }

  .notificationsList {
    z-index: 999999;
    width: 300px;
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    top: 100%;
    margin-top: 10px;
    right: 0;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
    font-size: 0.85rem;

    small {
      font-size: 0.7rem;
    }

    .list-group-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .list-group-item-empty {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
