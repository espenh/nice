import xled
discovered_device = xled.discover.discover()
discovered_device.id
control = xled.ControlInterface(discovered_device.ip_address, discovered_device.hw_address)
control.set_mode('movie')
control.get_mode()['mode']
control.get_device_info()['number_of_led']
