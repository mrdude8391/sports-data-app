# Start From the official Python image
FROM python:3.14-slim
# Set the working directory in the container
WORKDIR /server-py
# Copy the dependencies file to the working directory
COPY requirements.txt .
# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt
# Copy the content of the local src directory to the working directory
COPY . .
# Expose the port the app runs on
EXPOSE 8000
# Command to run the application
CMD ["uvicorn", "src.main:app", "--reload"]