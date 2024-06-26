import React, { useState } from "react";
import { Box, Button, Heading, VStack, HStack, Text, Divider, Spacer, OrderedList, ListItem, Flex } from "@chakra-ui/react";

const Index = () => {
  const [data, setData] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const jsonData = JSON.parse(e.target.result);
      setData(jsonData.data);
    };
    reader.readAsText(file);
  };

  const handleProjectClick = (projectId) => {
    setSelectedProject({
      id: projectId,
      edits: Object.values(data[projectId]),
    });
  };

  const handleClearData = () => {
    setData(null);
    setSelectedProject(null);
  };

  return (
    <Flex>
      <Box width="300px" bg="gray.100" p={4}>
        <VStack align="stretch" spacing={4}>
          <Heading size="md">Projects</Heading>
          <Divider />
          {data ? (
            <OrderedList>
              {Object.keys(data).map((projectId) => (
                <ListItem key={projectId} cursor="pointer" onClick={() => handleProjectClick(projectId)}>
                  {projectId}
                </ListItem>
              ))}
            </OrderedList>
          ) : (
            <Text>No data loaded</Text>
          )}
          <Spacer />
          <HStack>
            <Button as="label" htmlFor="file-upload" variant="outline">
              Upload JSON
            </Button>
            <input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
            <Button onClick={handleClearData} variant="outline">
              Clear Data
            </Button>
          </HStack>
        </VStack>
      </Box>
      <Box flex={1} p={4}>
        <Heading size="lg" mb={4}>
          Edits
        </Heading>
        {selectedProject ? (
          <OrderedList>
            {console.log("Selected Project:", selectedProject)}
            {console.log("Selected Project Edits:", selectedProject.edits)}
            {selectedProject.edits.sort((a, b) => {
              console.log("Sort - Edit A:", a);
              console.log("Sort - Edit B:", b);
              if (a.created_at && b.created_at) {
                return b.created_at.__time__ - a.created_at.__time__;
              } else if (a.created_at) {
                return -1;
              } else if (b.created_at) {
                return 1;
              } else {
                return 0;
              }
            })}
            {console.log("Sorted Edits:", selectedProject.edits)}
            {selectedProject.edits.map(
              (edit, index) => (
                console.log("Map - Edit:", edit),
                (
                  <ListItem key={index}>
                    <Text>
                      <strong>Created:</strong> {new Date(edit.created).toLocaleString()}
                    </Text>
                    <Text>
                      <strong>Prompt:</strong> {edit.prompt}
                    </Text>
                    <Text>
                      <strong>Status:</strong> {edit.status}
                    </Text>
                    <Divider my={2} />
                    {edit.code_blocks && edit.code_blocks.length > 0 ? (
                      <>
                        <Heading size="sm">Code Blocks</Heading>
                        {edit.code_blocks.map((block, i) => (
                          <Box key={i} p={2} bg="gray.100" borderRadius="md">
                            <pre>{block}</pre>
                          </Box>
                        ))}
                      </>
                    ) : (
                      <Text>No code blocks available for this edit</Text>
                    )}
                    <Divider my={4} />
                  </ListItem>
                )
              ),
            )}
          </OrderedList>
        ) : (
          <Text>Select a project to view edits</Text>
        )}
      </Box>
    </Flex>
  );
};

export default Index;
