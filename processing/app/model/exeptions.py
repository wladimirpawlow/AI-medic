class SetpointsOperationError(Exception):
    def __init__(self, message, item_type, data=None):
        self.message = message
        self.item_type = item_type
        self.recipe_data = data
        super().__init__(f"Setpoints operation failed: {message}")

